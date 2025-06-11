import { Injectable } from '@nestjs/common';
import { AuditRouteDto, ConfirmAuditRouteDto, GetInfoByRouteId, ListAuditRouteDto } from './dto/audit_route.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TransporterTravel } from '../transporter_travel/entities/transporter_travel.entity';
import { In, Repository } from 'typeorm';
import { Reception } from '../receptions/entities/reception.entity';
import { AuditRoute } from './entities/audit_route.entity';
import { Child } from '../catalogs/entities/child.entity';
import { AUDIT_ROUTE_STATUS, NOTE_CREDIT_STATUS } from 'src/core/constants/status.constant';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { AuditRouteDetail } from './entities/audit_route_detail.entity';
import { TransporterTravelDetail } from '../transporter_travel/entities/transporter_travel_detail.entity';
import { Product } from '../products/entities/product.entity';
import { UserContextService } from '../users/user-context.service';
import { CollectionRequest } from '../collection_request/entities/collection_request.entity';
import { Transporter } from '../transporters/entities/transporter.entity';
import { NotesCreditsService } from '../notes_credits/notes_credits.service';
import { TYPES_OF_COLLECTION_SITES } from 'src/core/constants/system.constant';

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
		@InjectRepository(Child)
		private readonly childRepository: Repository<Child>,
		@InjectRepository(CollectionRequest)
		private readonly collectionRequestRepository: Repository<CollectionRequest>,
		@InjectRepository(Transporter)
		private readonly transporterRepository: Repository<Transporter>,
		private userContextService: UserContextService,
		private notesCreditsService: NotesCreditsService,
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
			createdAt: data.createdAt
		});

		const transporterTravels = await this.transporterTravelRepository
			.createQueryBuilder('transporter_travel')
			.leftJoinAndMapOne('transporter_travel.routeId', AuditRoute, 'auditRoute', 'auditRoute.routeId = transporter_travel.routeId')
			.leftJoinAndSelect('transporter_travel.transporter', 'transporter')
			.andWhere('auditRoute.id IS NULL OR auditRoute.requestStatusId = :requestStatusId', { requestStatusId: AUDIT_ROUTE_STATUS.BY_CONCILLIATE })
			.select([
				'transporter_travel.routeId',
				'transporter_travel.totalQuantity',
				'transporter_travel.movementDate',
				'transporter_travel.createdAt',
				'transporter_travel.zone',
				'transporter'
			])
			.getMany();

		const mappedTransporterTravels = transporterTravels.map((travel) =>
			mapToAuditRouteDto(
				'TRANSPORTADORA',
				{
					transporter: travel.transporter,
					routeId: travel.routeId,
					movementDate: travel.movementDate,
					zone: travel.zone,
					createdAt: travel.createdAt
				},
				travel.totalQuantity,
				'EN TRANSITO'
			)
		);

		const receptions = await this.receptionRepository
			.createQueryBuilder('reception')
			.leftJoinAndSelect('reception.receptionDetails', 'receptionDetails')
			.leftJoinAndSelect('reception.auditRoute', 'auditRoute')
			.leftJoinAndSelect('reception.transporter', 'transporter')
			.leftJoinAndSelect('reception.collectionSite', 'collectionSite')
			.andWhere('auditRoute.id IS NULL OR auditRoute.requestStatusId = :requestStatusId', { requestStatusId: AUDIT_ROUTE_STATUS.BY_CONCILLIATE })
			.getMany();

		const mappedReceptions = receptions.map((reception) =>
			mapToAuditRouteDto(
				'RECUPERADORA',
				{
					transporter: reception.transporter,
					routeId: reception.routeId,
					movementDate: '',
					zone: '',
					createdAt: reception.createdAt,
					recuperator: reception?.collectionSite?.name || 'N/A',
				},
				reception.receptionDetails.reduce((acc, detail) => acc += parseInt(detail.quantity.toString()), 0),
				'SIN GUIA'
			)
		);

		const mergedResults: Record<string, ListAuditRouteDto> = {};

		[...mappedTransporterTravels, ...mappedReceptions].forEach((item) => {
			const key = `${item.routeId}-${item.transporter?.id}`;

			if (mergedResults[key]) {
				mergedResults[key].origin = 'RECUPERADORA';
				mergedResults[key].status = 'POR CONCILIAR';
				mergedResults[key].recuperator = mergedResults[key].recuperator || item.recuperator;
				mergedResults[key].quantityTotal = item.quantityTotal || 0;
			} else {
				mergedResults[key] = item;
			}
		});

		const finalResults = Object.values(mergedResults);

		return finalResults.sort((a, b) => {
			const dateA = new Date(a.createdAt).getTime();
			const dateB = new Date(b.createdAt).getTime();
			return dateB - dateA;
		});
	}

	async findAll(requestStatusId = AUDIT_ROUTE_STATUS.CONFIRMED): Promise<ListAuditRouteDto[]> {
		try {
			// Consulta optimizada con TypeORM QueryBuilder
			const items = await this.auditRouteRepository
				.createQueryBuilder('auditRoute')
				.leftJoinAndSelect('auditRoute.reception', 'reception')
				.leftJoinAndSelect('auditRoute.auditRouteDetails', 'auditRouteDetails')
				.leftJoinAndSelect('auditRoute.collectionRequest', 'collectionRequest')
				.leftJoinAndSelect('collectionRequest.collectionSite', 'collectionSite')
				.leftJoinAndMapOne('auditRoute.requestStatus', Child, 'requestStatus', 'requestStatus.id = auditRoute.requestStatusId')
				.leftJoinAndMapOne('auditRoute.zone', Child, 'zone', 'zone.id = auditRoute.zoneId')
				.leftJoinAndMapOne('auditRoute.transporterTravel', TransporterTravel, 'transporterTravel', 'transporterTravel.routeId = auditRoute.routeId')
				.leftJoinAndMapOne('auditRoute.transporter', Transporter, 'transporter', 'transporter.id = auditRoute.transporterId')
				.where('requestStatus.id = :requestStatusId', { requestStatusId })
				.getMany();

			return items.map((item) => this.mapToDto(item));
		} catch (error) {
			throw new Error('Failed to retrieve audit routes');
		}
	}

	private mapToDto(item: any): ListAuditRouteDto {
		return {
			origin: 'RECUPERADORA',
			transporter: item.transporter,
			routeId: item.routeId,
			zone: item.zone?.name || 'N/A',
			date: item.date,
			recuperator: item.collectionRequest?.collectionSite?.name || 'N/A',
			quantityTotal: item.conciliationTotal || 0,
			gap: (item.recuperatorTotal || 0) - (item.transporterTotal || 0),
			status: 'CONFIRMADO',
			createdAt: item.createdAt,
		};
	}

	async findOneByRoute(content: GetInfoByRouteId): Promise<AuditRouteDto> {
		const { routeId, transporterId } = content;

		if (!routeId) {
			throw new BusinessException('El número de ruta es obligatorio', 400);
		}

		if (!transporterId) {
			throw new BusinessException('La transportadora es obligatoria', 400);
		}

		const transporter = await this.transporterRepository.findOne({
			where: { id: +transporterId, status: true },
		});

		if (!transporter) {
			throw new BusinessException('La transportadora no existe o no está activa', 400);
		}

		// Verificar si existe un viaje asociado a la transportadora y la ruta
		const transporterTravel = await this.transporterTravelRepository.find({
			where: { transporter: { id: +transporterId }, routeId },
			relations: ['details'],
		});
		if (transporterTravel.length === 0) {
			throw new BusinessException('No existen registros de viajes realizados por la transportadora', 400);
		}

		// Verificar si existe un solicitud asociada
		const collectionRequest = await this.collectionRequestRepository.findOne({
			where: { transporter: { id: +transporterId }, routeId },
			relations: ['client', 'collectionSite'],
		});
		if (!collectionRequest) {
			throw new BusinessException('No existen registros en las solicitudes de recogida', 400);
		}

		// Verificar si existe una auditoría previa para esta ruta y transportadora
		const auditRoute = await this.auditRouteRepository.findOne({
			where: { transporterId: +transporterId, routeId },
			relations: ['auditRouteDetails', 'auditRouteDetails.product']
		});

		let reception = await this.receptionRepository.createQueryBuilder('reception')
			.leftJoinAndSelect('reception.transporter', 'transporter')
			.leftJoinAndSelect('reception.receptionDetails', 'receptionDetails')
			.leftJoinAndSelect('reception.receptionPhotos', 'receptionPhotos')
			.leftJoinAndSelect('receptionDetails.product', 'product')
			.leftJoinAndMapOne('product.productTypeId', Child, 'productType', 'productType.id = product.productTypeId')
			.where('transporter.id = :id AND reception.routeId = :routeId', { id: +transporterId, routeId })
			.getOne();

		if (!reception) {
			throw new BusinessException('No existen registros en la información cargada en la recepción', 400);
		}

		reception.receptionDetails = reception.receptionDetails.map((element: any) => ({
			productTypeName: element.product.productTypeId?.name,
			...element,
		}))

		if (auditRoute) {
			const zone = await this.childRepository.findOne({
				where: { status: true, id: auditRoute.zoneId },
			});

			// Buscar el estado de solicitud de auditoría
			const requestStatus = await this.childRepository.findOne({
				where: { status: true, id: auditRoute.requestStatusId },
			});

			const client = {
				name: collectionRequest.collectionSite.name,
				isAgency: collectionRequest.collectionSite.siteTypeId === TYPES_OF_COLLECTION_SITES.AGENCY
			}

			const t = transporterTravel.flatMap(({ details, ...element }) => details.map((y) => ({ ...element, ...y, client })))

			const _products = auditRoute.auditRouteDetails.reduce((acc, element) => {
				acc[element.product.id] = {
					name: element.product.name,
					productId: element.product.id,
					quantity: element.quantityConciliated,
					id: element.id,
				}
				return acc;
			}, {});

			return {
				transporter,
				routeId,
				zone: zone?.name || 'Sin zona asignada',
				date: auditRoute.date,
				reception,
				transporterTravel: t,
				recuperatorTotal: auditRoute.recuperatorTotal,
				transporterTotal: auditRoute.transporterTotal,
				conciliationTotal: auditRoute.conciliationTotal,
				requestStatus: requestStatus.name,
				products: Object.values(_products),
			};
		}

		// const reception = await this.receptionRepository.findOne({
		// 	where: { transporter: { id: +transporterId }, routeId },
		// 	relations: ['receptionDetails', 'receptionPhotos', 'receptionDetails.product', 'receptionDetails.product.productTypeId'],
		// });

		const recuperatorTotal = reception.receptionDetails.reduce(
			(acc, detail) => acc + parseInt(detail.quantity.toString(), 10),
			0
		);

		// Buscar el estado de solicitud de auditoría
		const requestStatus = await this.childRepository.findOne({
			where: { status: true, id: AUDIT_ROUTE_STATUS.BY_CONCILLIATE },
		});

		const client = {
			name: collectionRequest.collectionSite.name,
			isAgency: collectionRequest.collectionSite.siteTypeId === TYPES_OF_COLLECTION_SITES.AGENCY
		}

		const t = transporterTravel.flatMap(({ details, ...element }) => details.map((y) => ({ ...element, ...y, client })))

		return {
			transporter,
			routeId,
			zone: transporterTravel[0].zone || 'Sin zona asignada',
			date: transporterTravel[0].movementDate,
			reception,
			transporterTravel: t,
			recuperatorTotal,
			transporterTotal: t.reduce((acc, a) => (acc += parseInt(a.quantity.toString())), 0),
			conciliationTotal: 0,
			requestStatus: requestStatus.name,
			products: []
		};
	}

	async confirm({
		routeId,
		transporterId,
		conciliationTotal,
		recuperatorTotal,
		transporterTotal,
		products,
		isSave,
		transporter,
	}: ConfirmAuditRouteDto): Promise<void> {
		// Validar si existe la auditoría de ruta
		let auditRoute = await this.auditRouteRepository.findOne({
			where: { routeId, transporterId },
		});

		if (auditRoute && +auditRoute.requestStatusId !== AUDIT_ROUTE_STATUS.BY_CONCILLIATE) {
			throw new BusinessException(
				'La auditoría de ruta no aplica para la acción a ejecutar',
				400
			);
		}

		// Obtener viajes de la transportadora
		let transporterTravels = await this.transporterTravelRepository.find({
			where: { routeId, transporter: { id: transporterId } },
			relations: ['details'],
		});

		if (transporterTravels.length === 0) {
			throw new BusinessException(
				'No existe registro en la información de la transportadora viaje',
				400
			);
		}

		// Filtrar productos para crear y actualizar
		const createTransporterItems = transporter.filter(
			(item) => !item.id && item.productName && item.isNew
		);
		const updateTransporterItems = transporter.filter((item) => item.id);

		// Crear y actualizar detalles de viaje de la transportadora
		await this.transporterTravelRepository.manager.transaction(
			async (transactionalEntityManager) => {
				// Crear nuevos detalles
				if (createTransporterItems.length > 0) {
					const createdTransporterDetails = await Promise.all(
						createTransporterItems.map(async ({ productName, quantity, guideNumber }) => {
							const transporterTravel = await this.transporterTravelRepository.findOne({
								where: { guideId: guideNumber, transporter: { id: transporterId }, routeId },
							});

							if (!transporterTravel) return null;

							return this.transporterTravelDetailRepository.create({
								batteryType: productName,
								quantity,
								quantityConciliated: quantity,
								travelRecord: transporterTravel,
							});
						})
					);

					await transactionalEntityManager.save(createdTransporterDetails.filter(Boolean));
				}

				// Actualizar detalles existentes
				if (updateTransporterItems.length > 0) {
					for (const { id, quantity: quantityConciliated } of updateTransporterItems) {
						await transactionalEntityManager.update(
							TransporterTravelDetail,
							id,
							{ quantityConciliated }
						);
					}
				}

				for (const travelRecord of transporterTravels) {
					const updatedDetails = await transactionalEntityManager.find(TransporterTravelDetail, {
						where: { travelRecord }
					});

					const totalQuantity = updatedDetails.reduce(
						(sum, detail) => sum + (detail.quantity || 0),
						0
					);

					await transactionalEntityManager.update(
						TransporterTravel,
						{ id: travelRecord.id },
						{ totalQuantity }
					);
				}
			}
		);

		transporterTravels = await this.transporterTravelRepository.find({
			where: { routeId, transporter: { id: transporterId } },
			relations: ['details'],
		});

		// Obtener productos activos
		const activeProducts = await this.productRepository.find({ where: { status: true } });
		const productMap = activeProducts.reduce((acc, product) => {
			acc[product.name] = product;
			return acc;
		}, {});

		conciliationTotal = transporterTravels.reduce(
			(acc, travel) => {
				const total = travel.details.reduce(
					(sum, detail) => sum + (detail.quantityConciliated || 0),
					0
				);
				return acc + total;
			}, 0)

		// Crear nueva auditoría de ruta si no existe
		if (!auditRoute) {
			const collectionRequest = await this.collectionRequestRepository.findOne({
				where: { transporter: { id: +transporterId }, routeId },
				relations: ['client', 'collectionSite'],
			});

			if (!collectionRequest) {
				throw new BusinessException(
					'No existen registros en las solicitudes de recogida',
					400
				);
			}

			const reception = await this.receptionRepository.findOne({
				where: { routeId, transporter: { id: transporterId } },
			});

			if (!reception) {
				throw new BusinessException(
					'No existe registro en la información de la recepción',
					400
				);
			}

			const zone = await this.childRepository.findOne({
				where: { name: transporterTravels[0].zone.toUpperCase() },
			});

			if (!zone) {
				throw new BusinessException(
					'No existe la zona configurada en el registro de la transportadora viaje',
					400
				);
			}

			const userId = this.userContextService.getUserDetails()?.id;

			const auditRouteDetails = transporterTravels.flatMap((travel) =>
				travel.details.map((detail) => ({
						guideId: travel.guideId,
						product: productMap[detail.batteryType],
						quantity: detail.quantity,
						quantityConciliated: products.find(
							(product) => +product.productId === +productMap[detail.batteryType]?.id
						)?.quantity
					}))
			);

			auditRouteDetails.forEach((e) => {
				const index = products.findIndex((y) => y.productId === e.product.id);
				if (index > -1) {
					products.slice(index, 1);
				}
			})

			const newAuditRoute = this.auditRouteRepository.create({
				createdBy: userId,
				modifiedBy: userId,
				routeId,
				reception,
				date: transporterTravels[0].movementDate,
				zoneId: zone.id,
				recuperatorId: collectionRequest.collectionSite.id,
				transporterId,
				requestStatusId: AUDIT_ROUTE_STATUS.BY_CONCILLIATE,
				conciliationTotal,
				recuperatorTotal,
				transporterTotal,
				auditRouteDetails,
				collectionRequest,
			});

			auditRoute = await this.auditRouteRepository.save(newAuditRoute);
		}

		// Filtrar productos para crear y actualizar
		const createProductItems = products.filter(
			(item) => item.productId && !item.id
		);
		const updateProductItems = products.filter((item) => item.id);

		const guideIdMap = transporterTravels.reduce((acc, travel) => {
			travel.details.forEach((detail) => {
				const productId = productMap[detail.batteryType]?.id;
				if (productId) {
					acc[productId] = {quantity: detail.quantity, guideId: travel.guideId};
				}
			});
			return acc;
		}, {} as Record<number, { quantity: number, guideId: string }>);

		await this.auditRouteDetailRepository.manager.transaction(
			async (transactionalEntityManager) => {
				for (const { productId, quantity: quantityConciliated } of createProductItems) {
					const guide = guideIdMap[productId];
					const guideId = guide.guideId;

					// if (!guideId) continue;

					// Verificar si ya existe un detalle con el mismo productId y guideId
					const existingDetail = await this.auditRouteDetailRepository.findOne({
						where: {
							product: { id: productId },
							guideId,
							auditRoute
						},
					});

					if (existingDetail) {
						// Si existe, actualizar la cantidad
						await transactionalEntityManager.update(
							AuditRouteDetail,
							{ id: existingDetail.id },
							{ quantityConciliated }
						);
					} else {
						// Si no existe, crear un nuevo detalle
						const newAuditRouteDetail = this.auditRouteDetailRepository.create({
							auditRoute: auditRoute || undefined, // Asegurarse de que auditRoute no sea undefined
							product: { id: +productId }, // Convertir productId a número
							quantity: guide.quantity,
							quantityConciliated,
							guideId,
						});

						await transactionalEntityManager.save(newAuditRouteDetail);
					}
				}

				// Actualizar detalles existentes
				if (updateProductItems.length > 0) {
					for (const { id, quantity: quantityConciliated } of updateProductItems) {
						await transactionalEntityManager.update(
							AuditRouteDetail,
							id,
							{ quantityConciliated }
						);
					}
				}
			}
		);

		// Confirmar auditoría si no se guarda como borrador
		if (!isSave) {
			await this.auditRouteRepository.update(auditRoute.id, {
				requestStatusId: AUDIT_ROUTE_STATUS.CONFIRMED,
				notify: await this.calculateIsNotify({ routeId, transporterId }),
				conciliationTotal,
				recuperatorTotal,
				transporterTotal
			});

			if (recuperatorTotal - transporterTotal < 0) {
				await this.notesCreditsService.create(auditRoute.id);
			}

		} else {
			await this.auditRouteRepository.update(auditRoute.id, {
				conciliationTotal,
				recuperatorTotal,
				transporterTotal,
			});
		}
	}

	async calculateIsNotify({ routeId, transporterId }): Promise<boolean> {
		const collectionRequest = await this.collectionRequestRepository.find({ where: { routeId, transporter: { id: transporterId }, collectionSite: { siteTypeId: TYPES_OF_COLLECTION_SITES.RECOVERY } }, relations: ['collectionSite'] });

		if (!collectionRequest) {
			// throw new BusinessException('No existe una solicitud de recogida configurada con la ruta: ' + routeId, 400);
			return false;
		}

		return true;
	}
}
