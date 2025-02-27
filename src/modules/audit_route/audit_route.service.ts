import { Injectable } from '@nestjs/common';
import { ConciliateByTypesAuditRouteDto, ConciliateTotalsAuditRouteDto, ListAuditRouteDto } from './dto/audit_route.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TransporterTravel } from '../transporter_travel/entities/transporter_travel.entity';
import { Repository } from 'typeorm';
import { Reception } from '../receptions/entities/reception.entity';
import { AuditRoute } from './entities/audit_route.entity';
import { Child } from '../catalogs/entities/child.entity';
import { AUDIT_ROUTE_STATUS } from 'src/core/constants/status.constant';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { AuditRouteDetail } from './entities/audit_route_detail.entity';

@Injectable()
export class AuditRouteService {

	constructor(
		@InjectRepository(TransporterTravel)
		private readonly transporterTravelRepository: Repository<TransporterTravel>,
		@InjectRepository(Reception)
		private readonly receptionRepository: Repository<Reception>,
		@InjectRepository(AuditRoute)
		private readonly auditRouteRepository: Repository<AuditRoute>,
		@InjectRepository(AuditRouteDetail)
		private readonly auditRouteDetailRepository: Repository<AuditRouteDetail>,
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

		const transporterTravels = await this.transporterTravelRepository
			.createQueryBuilder('transporterTravel')
			.leftJoinAndSelect('transporterTravel.auditRoutes', 'auditRoute')
			.where('auditRoute.id IS NULL')
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
			.createQueryBuilder('receptions')
			.leftJoinAndSelect('receptions.receptionDetails', 'receptionDetails')
			.leftJoinAndSelect('receptions.auditRoutes', 'auditRoute')
			.where('auditRoute.id IS NULL')
			.getMany();

		const mappedReceptions = receptions.map((reception) =>
			mapToAuditRouteDto(
				'RECEPCIÓN',
				reception,
				reception.receptionDetails.reduce((acc, detail) => acc + detail.quantity, 0),
				'SIN GUIA'
			)
		);

		return [...mappedTransporterTravels, ...mappedReceptions];
	}

	async findAll(): Promise<AuditRoute[]> {
		return this.auditRouteRepository.createQueryBuilder('auditRoute')
			.leftJoinAndSelect('auditRoute.transporterTravel', 'transporterTravel')
			.leftJoinAndSelect('auditRoute.reception', 'reception')
			.leftJoinAndSelect('auditRoute.auditRouteDetails', 'auditRouteDetails')
			.leftJoinAndMapOne('auditRoute.requestStatusId', Child, 'requestStatus', 'requestStatus.id = auditRoute.requestStatusId')
			.getMany();
	}

	async conciliateTotals(id: number, content: ConciliateTotalsAuditRouteDto): Promise<void> {
		let auditRoute = await this.auditRouteRepository.findOne({ where: { id, status: true } });

		if (!auditRoute) {
			throw new BusinessException('Auditoria de ruta no encontrada', 404);
		}

		if (auditRoute.requestStatusId !== AUDIT_ROUTE_STATUS.BY_CONCILLIATE) {
			throw new BusinessException('La auditoria de ruta no aplica para la acción a ejecutar', 404);
		}

		await this.auditRouteRepository.update(id, content);
	}

	async conciliateByTypes(id: number, { content }: ConciliateByTypesAuditRouteDto): Promise<void> {
		const auditRoute = await this.auditRouteRepository.findOne({ where: { id, status: true } });
		if (!auditRoute) {
			throw new BusinessException('Auditoria de ruta no encontrada', 404);
		}

		if (auditRoute.requestStatusId !== AUDIT_ROUTE_STATUS.BY_CONCILLIATE) {
			throw new BusinessException('La auditoria de ruta no aplica para la acción a ejecutar', 400);
		}

		const createItems = content.filter((element) => !element.id && element.productId);
		const updateItems = content.filter((element) => element.id);

		await this.auditRouteDetailRepository.manager.transaction(async (transactionalEntityManager) => {
			if (createItems.length > 0) {
				const createdItems = createItems.map(({ productId, quantity }) =>
					this.auditRouteDetailRepository.create({
						auditRoute: { id },
						product: { id: productId },
						quantity,
						quantityConciliated: quantity,
					})
				);
				await transactionalEntityManager.save(createdItems);
			}

			if (updateItems.length > 0) {
				for (const { id, quantity: quantityConciliated } of updateItems) {
					await transactionalEntityManager.update(AuditRouteDetail, id, { quantityConciliated });
				}
			}
		});
	}
}
