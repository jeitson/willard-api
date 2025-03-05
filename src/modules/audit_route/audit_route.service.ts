import { Injectable } from '@nestjs/common';
import { ConciliateTotalsAuditRouteDto, ConfirmAuditRouteDto, CreateAuditRouteDto, ListAuditRouteDto } from './dto/audit_route.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TransporterTravel } from '../transporter_travel/entities/transporter_travel.entity';
import { In, Repository } from 'typeorm';
import { Reception } from '../receptions/entities/reception.entity';
import { AuditRoute } from './entities/audit_route.entity';
import { Child } from '../catalogs/entities/child.entity';
import { AUDIT_ROUTE_STATUS } from 'src/core/constants/status.constant';
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
				const createdItemsTransporter = createItemsTransporter.map(({ productName, quantity, guideNumber: guideId }) => {

					const transporterTravel = this.transporterTravelRepository.find({ where: { guideId } });

					if (!transporterTravel) {
						// TODO: Hace fatla verificar que ocurre en este caso
						return;
					}

					return this.transporterTravelDetailRepository.create({
						batteryType: productName,
						quantity: quantity,
						quantityConciliated: quantity
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

	async synchronizeAndCreate(routes: string[]): Promise<void> {
		if (routes.length === 0) return;

		// Paso 1: Obtener viajes de transportadora sin auditoría
		const transporterTravels = await this.transporterTravelRepository
			.createQueryBuilder('transporterTravel')
			.leftJoinAndSelect('transporterTravel.auditRoutes', 'auditRoute')
			.where('auditRoute.id IS NULL')
			.andWhere('transporterTravel.routeId IN (:...routes)', { routes })
			.getMany();

		if (transporterTravels.length === 0) return;

		// Paso 2: Obtener recepciones sin auditoría
		const receptions = await this.receptionRepository
			.createQueryBuilder('receptions')
			.leftJoinAndSelect('receptions.receptionDetails', 'receptionDetails')
			.leftJoinAndSelect('receptions.auditRoutes', 'auditRoute')
			.where('auditRoute.id IS NULL')
			.andWhere('receptions.routeId IN (:...routes)', { routes })
			.getMany();

		if (receptions.length === 0) return;

		// Paso 3: Consultar todos los productos únicos por batteryType
		const allBatteryTypes = transporterTravels
			.flatMap((travel) => travel.details.map((detail) => detail.batteryType));
		const uniqueBatteryTypes = [...new Set(allBatteryTypes)]; // Eliminar duplicados

		// Consultar productos por batteryType
		const products = await this.productRepository.find({
			where: { name: In(uniqueBatteryTypes) }, // Asumiendo que `name` es el campo que almacena el tipo de batería
		});

		const productMap = new Map(products.map((product) => [product.name, product.id]));

		// Paso 4: Mapear datos para crear auditorías
		const auditRouteDtos: CreateAuditRouteDto[] = [];

		for (const travel of transporterTravels) {
			const matchingReception = receptions.find(
				(reception) => reception.routeId === travel.routeId,
			);

			if (!matchingReception) continue;

			// Mapear detalles del viaje y la recepción
			const details = travel.details.map((travelDetail) => {
				const productId = productMap.get(travelDetail.batteryType); // Obtener ID del producto por batteryType
				if (!productId) {
					throw new BusinessException(
						`No se encontró un producto con el tipo de batería: ${travelDetail.batteryType}`,
						400,
					);
				}

				const matchingReceptionDetail = matchingReception.receptionDetails.find(
					(receptionDetail) => receptionDetail.product.id === productId,
				);

				return {
					guideId: travel.guideId,
					productId: productId, // Usar el ID del producto consultado
					quantity: travelDetail.quantity,
					quantityConciliated: matchingReceptionDetail
						? matchingReceptionDetail.quantity
						: 0
				};
			});

			auditRouteDtos.push({
				routeId: travel.routeId,
				receptionId: matchingReception.id,
				transporterTravelId: travel.id,
				date: travel.movementDate,
				requestStatusId: AUDIT_ROUTE_STATUS.BY_CONCILLIATE,
				details,
			});
		}

		// Paso 5: Crear auditorías
		await this.create(auditRouteDtos);
	}

	async create(content: CreateAuditRouteDto[]): Promise<void> {
		if (content.length === 0) return;

		const { id: userId } = this.userContextService.getUserDetails();

		const queryRunner = this.auditRouteRepository.manager.connection.createQueryRunner();
		await queryRunner.startTransaction();

		try {
			// Extraer IDs de productos únicos
			const productIds = content.flatMap((item) =>
				item.details.map(({ productId }) => productId),
			);
			const products = await this.productRepository.findBy({ id: In(productIds) });
			const productMap = new Map(products.map((product) => [product.id, product]));

			// Crear entidades de auditoría
			const auditRoutes = content.map((element) =>
				this.auditRouteRepository.create({
					...element,
					requestStatusId: AUDIT_ROUTE_STATUS.BY_CONCILLIATE,
					createdBy: userId,
					modifiedBy: userId,
					auditRouteDetails: element.details.map((item) => ({
						product: productMap.get(item.productId),
						guideId: item.guideId,
						quantity: item.quantity,
						quantityConciliated: item.quantityConciliated,
					})),
				}),
			);

			// Guardar auditorías
			const savedAuditRoutes = await queryRunner.manager.save(auditRoutes);

			if (!savedAuditRoutes.every((element) => element.id)) {
				throw new BusinessException(
					'Error al guardar la información de la auditoría.',
					500,
				);
			}

			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw new BusinessException(
				error.message || 'Error inesperado en la creación de la auditoría.',
				500,
			);
		} finally {
			await queryRunner.release();
		}
	}
}
