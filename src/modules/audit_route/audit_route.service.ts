import { Injectable } from '@nestjs/common';
import { ConciliateTotalsAuditRouteDto, ConfirmAuditRouteDto, CreateAuditRouteDto, ListAuditRouteDto } from './dto/audit_route.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TransporterTravel } from '../transporter_travel/entities/transporter_travel.entity';
import { In, Repository } from 'typeorm';
import { Reception } from '../receptions/entities/reception.entity';
import { AuditRoute } from './entities/audit_route.entity';
import { Child } from '../catalogs/entities/child.entity';
import { AUDIT_ROUTE_REASON, AUDIT_ROUTE_STATUS } from 'src/core/constants/status.constant';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { AuditRouteDetail } from './entities/audit_route_detail.entity';
import { TransporterTravelDetail } from '../transporter_travel/entities/transporter_travel_detail.entity';
import { Product } from '../products/entities/product.entity';
import { UserContextService } from '../users/user-context.service';

@Injectable()
export class AuditRouteService {

	constructor(
		@InjectRepository(TransporterTravel)
		private readonly transporterTravelRepository: Repository<TransporterTravel>,
		@InjectRepository(TransporterTravelDetail)
		private readonly transporterTravelDetailRepository: Repository<TransporterTravelDetail>,
		@InjectRepository(Reception)
		private readonly receptionRepository: Repository<Reception>,
		@InjectRepository(AuditRoute)
		private readonly auditRouteRepository: Repository<AuditRoute>,
		@InjectRepository(AuditRouteDetail)
		private readonly auditRouteDetailRepository: Repository<AuditRouteDetail>,
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,
		private userContextService: UserContextService,
	) { }

	async findAllSyncPending(): Promise<ListAuditRouteDto[]> {
		const mapToAuditRouteDto = (
			origin: string,
			data: any,
			quantityTotal: number,
			status: string
		): ListAuditRouteDto => ({
			origin,
			transporter: data.transporter ?? null,
			routeId: data.routeId,
			zone: data.zone ?? '',
			date: data.movementDate ?? '',
			recuperator: data.recuperator ?? '',
			quantityTotal,
			gap: null,
			status,
		});

		let { transporter, zones } = this.userContextService.getUserDetails();

		if (!transporter) {
			throw new BusinessException('El usuario no tiene configurado una transportadora');
		}

		if (zones.length === 0) {
			throw new BusinessException('El usuario no tiene configurado zonas');
		}

		zones = zones.map(({ zone }) => zone.name)

		const transporterTravels = await this.transporterTravelRepository
			.createQueryBuilder('transporter_travel')
			.leftJoinAndMapOne('transporter_travel.routeId', AuditRoute, 'auditRoute', 'auditRoute.routeId = transporter_travel.routeId')
			.leftJoinAndSelect('transporter_travel.transporter', 'transporter')
			.where('transporter_travel.zone IN (:...zones) AND transporter.id =: transporterId', { zones, transporterId: transporter.id })
			.andWhere('auditRoute.id IS NULL')
			.getMany();

		const mappedTransporterTravels = transporterTravels.map((travel) =>
			mapToAuditRouteDto(
				'VIAJE TRANSPORTADORA',
				travel,
				travel.totalQuantity,
				'EN TRANSITO'
			)
		);

		const receptions = await this.receptionRepository
			.createQueryBuilder('reception')
			.leftJoinAndSelect('reception.receptionDetails', 'receptionDetails')
			.leftJoinAndSelect('reception.auditRoutes', 'auditRoute')
			.leftJoinAndSelect('reception.transporter', 'transporter')
			.where('auditRoute.id IS NULL AND transporter.id =: transporterId', { transporterId: transporter.id })
			.getMany();

		const mappedReceptions = receptions.map((reception) =>
			mapToAuditRouteDto(
				'RECEPCIÓN',
				reception,
				reception.receptionDetails.reduce((acc, detail) => acc + detail.quantity, 0),
				'SIN GUIA'
			)
		);

		const auditsRoutes = await this.auditRouteRepository.find({
			where: {
				requestStatusId: AUDIT_ROUTE_STATUS.BY_CONCILLIATE,
				zoneId: In(zones),
				transporterId: transporter.id,
			},
			relations: ['auditRouteDetails']
		});

		const mappedAuditsRoutes = auditsRoutes.map((item) =>
			mapToAuditRouteDto(
				'RECUPERADORA - VIAJE TRANSPORTADORA',
				item,
				item.auditRouteDetails.reduce((acc, detail) => acc + detail.quantity, 0),
				'POR CONCILIAR'
			)
		);

		return [...mappedTransporterTravels, ...mappedReceptions, ...mappedAuditsRoutes];
	}

	async findAll(): Promise<AuditRoute[]> {
		let { transporter, zones } = this.userContextService.getUserDetails();

		if (!transporter) {
			throw new BusinessException('El usuario no tiene configurado una transportadora');
		}

		if (zones.length === 0) {
			throw new BusinessException('El usuario no tiene configurado zonas');
		}

		zones = zones.map(({ zone }) => zone.name)

		return this.auditRouteRepository.createQueryBuilder('auditRoute')
			.leftJoinAndSelect('auditRoute.reception', 'reception')
			.leftJoinAndSelect('auditRoute.transporter', 'transporter')
			.leftJoinAndSelect('auditRoute.auditRouteDetails', 'auditRouteDetails')
			.leftJoinAndMapOne('auditRoute.requestStatusId', Child, 'requestStatus', 'requestStatus.id = auditRoute.requestStatusId')
			// .leftJoinAndMapOne('auditRoute.zone', Child, 'zone', 'zone.name = auditRoute.zone')
			.leftJoinAndMapOne('auditRoute.transporterTravel', TransporterTravel, 'transporterTravel', 'transporterTravel.routeId = auditRoute.routeId')
			.where('zone IN (:...zones) AND transporter.id =: transporterId', { zones, transporterId: transporter.id })
			// .where('zone.name IN (:...zones) AND transporter.id =: transporterId', { zones, transporterId: transporter.id })
			.getMany();
	}

	async confirm(id: number, content: ConfirmAuditRouteDto): Promise<void> {
		let auditRoute = await this.auditRouteRepository.findOne({ where: { id, status: true } });

		if (!auditRoute) {
			throw new BusinessException('Auditoria de ruta no encontrada', 404);
		}

		if (auditRoute.requestStatusId !== AUDIT_ROUTE_STATUS.BY_CONCILLIATE) {
			throw new BusinessException('La auditoria de ruta no aplica para la acción a ejecutar', 404);
		}

		const { transporter, products, isSave } = content;

		// Transportadora
		const createItemsTransporter = transporter.filter((element) => !element.id && element.productName && element.isNew);
		const updateItemsTransporter = transporter.filter((element) => element.id);

		await this.transporterTravelRepository.manager.transaction(async (transactionalEntityManager) => {
			if (createItemsTransporter.length > 0) {
				const createdItemsTransporter = createItemsTransporter.map(async ({ productName, quantity, guideNumber: guideId }) => {

					const transporterTravel = await this.transporterTravelRepository.findOne({ where: { guideId } });

					if (!transporterTravel) return;

					return this.transporterTravelDetailRepository.create({
						batteryType: productName,
						quantity: quantity,
						quantityConciliated: quantity,
						travelRecord: transporterTravel
					})
				});

				await transactionalEntityManager.save(createdItemsTransporter);
			}

			if (updateItemsTransporter.length > 0) {
				for (const { id, quantity: quantityConciliated } of updateItemsTransporter) {
					await transactionalEntityManager.update(TransporterTravelDetail, id, { quantityConciliated });
				}
			}
		});

		// Productos
		const createItemsProducts = products.filter((element) => !element.id && element.productId);
		const updateItemsProducts = products.filter((element) => element.id);

		await this.auditRouteDetailRepository.manager.transaction(async (transactionalEntityManager) => {
			if (createItemsProducts.length > 0) {
				const createdItemsProducts = createItemsProducts.map(({ productId, quantity }) =>
					this.auditRouteDetailRepository.create({
						auditRoute: { id },
						product: { id: productId },
						quantity,
						quantityConciliated: quantity,
					})
				);
				await transactionalEntityManager.save(createdItemsProducts);
			}

			if (updateItemsProducts.length > 0) {
				for (const { id, quantity: quantityConciliated } of updateItemsTransporter) {
					await transactionalEntityManager.update(AuditRouteDetail, id, { quantityConciliated });
				}
			}
		});

		if (!isSave) {
			await this.auditRouteRepository.update(id, { requestStatusId: AUDIT_ROUTE_STATUS.CONFIRMED });
		}
	}
}
