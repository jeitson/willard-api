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
import { NoteCredit } from './entities/note_credit.entity';
import { CollectionRequest } from '../collection_request/entities/collection_request.entity';
import { Transporter } from '../transporters/entities/transporter.entity';

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
		@InjectRepository(NoteCredit)
		private readonly noteCreditRepository: Repository<NoteCredit>,
		@InjectRepository(CollectionRequest)
		private readonly collectionRequestRepository: Repository<CollectionRequest>,
		@InjectRepository(Transporter)
		private readonly transporterRepository: Repository<Transporter>,
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
			createdAt: data.createdAt
		});

		const transporterTravels = await this.transporterTravelRepository
			.createQueryBuilder('transporter_travel')
			.leftJoinAndMapOne('transporter_travel.routeId', AuditRoute, 'auditRoute', 'auditRoute.routeId = transporter_travel.routeId')
			.leftJoinAndSelect('transporter_travel.transporter', 'transporter')
			.andWhere('auditRoute.id IS NULL')
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
			.leftJoinAndSelect('reception.auditRoute', 'auditRoutes')
			.leftJoinAndSelect('reception.transporter', 'transporter')
			.getMany();

		const mappedReceptions = receptions.map((reception) =>
			mapToAuditRouteDto(
				'RECUPERADORA',
				{
					transporter: reception.transporter,
					routeId: reception.routeId,
					movementDate: '',
					zone: '',
					createdAt: reception.createdAt
				},
				reception.receptionDetails.reduce((acc, detail) => acc + detail.quantity, 0),
				'SIN GUIA'
			)
		);

		const mergedResults: Record<string, ListAuditRouteDto> = {};

		[...mappedTransporterTravels, ...mappedReceptions].forEach((item) => {
			const key = `${item.routeId}-${item.transporter?.id}`;

			if (mergedResults[key]) {
				mergedResults[key].origin = 'RECUPERADORA';
				mergedResults[key].status = 'POR CONCILIAR';
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

	async findAll(): Promise<AuditRoute[]> {
		return this.auditRouteRepository.createQueryBuilder('auditRoute')
			.leftJoinAndSelect('auditRoute.reception', 'reception')
			.leftJoinAndSelect('auditRoute.auditRouteDetails', 'auditRouteDetails')
			.leftJoinAndMapOne('auditRoute.requestStatusId', Child, 'requestStatus', 'requestStatus.id = auditRoute.requestStatusId')
			.leftJoinAndMapOne('auditRoute.transporterTravel', TransporterTravel, 'transporterTravel', 'transporterTravel.routeId = auditRoute.routeId')
			.leftJoinAndMapOne('auditRoute.transporterId', Transporter, 'transporter', 'transporter.id = auditRoute.transporterId')
			.where('requestStatus.id = :requestStatusId', { requestStatusId: AUDIT_ROUTE_STATUS.CONFIRMED })
			.getMany();
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
			relations: ['auditRouteDetails']
		});

		if (auditRoute) {
			const zone = await this.childRepository.findOne({
				where: { status: true, id: auditRoute.zoneId },
			});

			// Buscar el estado de solicitud de auditoría
			const requestStatus = await this.childRepository.findOne({
				where: { status: true, id: auditRoute.requestStatusId },
			});

			const t = transporterTravel.flatMap(({ details, ...element }) => details.map((y) => ({ ...y, ...element })))

			return {
				transporter,
				routeId,
				zone: zone?.name || 'Sin zona asignada',
				date: auditRoute.date,
				reception: auditRoute.reception,
				transporterTravel: t,
				recuperatorTotal: auditRoute.recuperatorTotal,
				transporterTotal: auditRoute.transporterTotal,
				conciliationTotal: auditRoute.conciliationTotal,
				requestStatus: requestStatus.name,
				products: auditRoute.auditRouteDetails.map((element) => ({
					name: element.product.name,
					productId: element.product.id,
					quantity: element.quantityConciliated,
					id: element.id,
				})),
				client: {
					name: collectionRequest.client.name,
					isAgency: collectionRequest.collectionSite.siteTypeId === 49
				}
			};
		}

		// const reception = await this.receptionRepository.findOne({
		// 	where: { transporter: { id: +transporterId }, routeId },
		// 	relations: ['receptionDetails', 'receptionPhotos', 'receptionDetails.product', 'receptionDetails.product.productTypeId'],
		// });

		let reception = await this.receptionRepository.createQueryBuilder('reception')
			.leftJoinAndSelect('reception.transporter', 'transporter')
			.leftJoinAndSelect('reception.receptionDetails', 'receptionDetails')
			.leftJoinAndSelect('reception.receptionPhotos', 'receptionPhotos')
			.leftJoinAndSelect('receptionDetails.product', 'product')
			.leftJoinAndMapOne('product.productTypeId', Child, 'productType', 'productType.id = product.productTypeId')
			.where('transporter.id = :id AND reception.routeId = :routeId', { id: +transporterId, routeId })
			.getOne();

		if (!reception) {
			throw new BusinessException('No existen registros en la información cargada en la recepción', 404);
		}

		reception.receptionDetails = reception.receptionDetails.map((element: any) => ({
			productTypeName: element.product.productTypeId?.name,
			...element,
		}))

		const products = await this.productRepository.find({ where: { status: true } });

		const recuperatorTotal = reception.receptionDetails.reduce(
			(acc, detail) => acc + parseInt(detail.quantity.toString(), 10),
			0
		);

		// Buscar el estado de solicitud de auditoría
		const requestStatus = await this.childRepository.findOne({
			where: { status: true, id: AUDIT_ROUTE_STATUS.BY_CONCILLIATE },
		});

		const t = transporterTravel.flatMap(({ details, ...element }) => details.map((y) => ({ ...y, ...element })))

		return {
			transporter,
			routeId,
			zone: transporterTravel[0].zone || 'Sin zona asignada',
			date: transporterTravel[0].movementDate,
			reception,
			transporterTravel: t,
			recuperatorTotal,
			transporterTotal: t.reduce((acc, a) => ( acc += parseInt(a.quantity.toString())), 0),
			conciliationTotal: 0,
			requestStatus: requestStatus.name,
			products: products.map((element) => ({
				name: element.name,
				productId: element.id,
				quantity: 0,
				id: 0,
			})),
			client: {
				name: collectionRequest.client.name,
				isAgency: collectionRequest.collectionSite.siteTypeId === 49
			}
		};
	}

	async confirm({ routeId, transporterId, conciliationTotal, recuperatorTotal, transporterTotal, products, isSave, transporter }: ConfirmAuditRouteDto): Promise<void> {
		const auditRoute = await this.auditRouteRepository.findOne({ where: { routeId, transporterId } });

		if (auditRoute.requestStatusId !== AUDIT_ROUTE_STATUS.BY_CONCILLIATE) {
			throw new BusinessException('La auditoria de ruta no aplica para la acción a ejecutar', 400);
		}

		// crear la auditoria de ruta
		const transporterTravels = await this.transporterTravelRepository.find({ where: { routeId, transporter: { id: transporterId } }, relations: ['details'] })

		if (transporterTravels.length === 0) {
			throw new BusinessException('No existe registro en la información de la transportadora viaje', 400);
		}

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

		if (!auditRoute) {
			const reception = await this.receptionRepository.findOne({ where: { routeId, transporter: { id: transporterId } } })

			if (!reception) {
				throw new BusinessException('No existe registro en la información de la recepción', 400);
			}

			const zone = await this.childRepository.findOne({ where: { name: transporterTravels[0].zone.toUpperCase() } })

			if (!zone) {
				throw new BusinessException('No existe la zona configurada en el registro de la transportadora viaje', 400);
			}

			const user_id = this.userContextService.getUserDetails()?.id;

			let allProducts: any = await this.productRepository.find({ where: { status: true } });
			allProducts = allProducts.reduce((acc, product) => acc[product.name] = product, {})

			const _products = transporterTravels.reduce((acc, element) => {
				element.details.map((detail) => ({
					guideId: element.guideId,
					product: allProducts[detail.batteryType],
					quantity: detail.quantity,
					quantityConciliated: products.find(product => product.productId === allProducts[detail.batteryType].id)?.quantity
				}))
				return acc;
			}, [])

			const itemSaved = this.auditRouteRepository.create(
				{
					createdBy: user_id,
					modifiedBy: user_id,
					routeId,
					reception,
					date: transporterTravels[0].movementDate,
					zoneId: zone.id,
					// recuperatorId: transporterTravel.recu
					transporterId,
					requestStatusId: AUDIT_ROUTE_STATUS.BY_CONCILLIATE,
					conciliationTotal,
					recuperatorTotal,
					transporterTotal,
					auditRouteDetails: _products
				}
			);

			await this.auditRouteRepository.save(itemSaved);
		}

		// Productos
		const createItemsProducts = products.filter((element) => !element.productId);
		const updateItemsProducts = products.filter((element) => element.id);

		await this.auditRouteDetailRepository.manager.transaction(async (transactionalEntityManager) => {
			if (createItemsProducts.length > 0) {
				const createdItemsProducts = createItemsProducts.map(({ productId, quantity }) =>
					this.auditRouteDetailRepository.create({
						auditRoute,
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
			await this.auditRouteRepository.update(auditRoute.id, { requestStatusId: AUDIT_ROUTE_STATUS.CONFIRMED, notify: await this.calculateIsNotify({ routeId, transporterId }) });
			this.createNoteCredit(auditRoute.id);
		}
	}

	async createNoteCredit(id: number): Promise<void> {
		const auditRoute = await this.auditRouteRepository.findOne({ where: { id }, relations: ['auditRouteDetails'] });

		if (auditRoute.requestStatusId !== AUDIT_ROUTE_STATUS.CONFIRMED) {
			throw new BusinessException('La auditoria de ruta no aplica para la acción a ejecutar', 400);
		}

		for (const element of auditRoute.auditRouteDetails) {
			const item = this.noteCreditRepository.create({
				auditRoute,
				requestStatusId: NOTE_CREDIT_STATUS.PENDING,
				product: element.product,
				quantity: element.quantityConciliated,
				guideId: element.guideId,
			})

			await this.noteCreditRepository.save(item);
		}
	}

	async calculateIsNotify({ routeId, transporterId }): Promise<boolean> {
		const collectionRequest = await this.collectionRequestRepository.find({ where: { routeId, transporter: { id: transporterId }, collectionSite: { siteTypeId: 48 } }, relations: ['collectionSite'] });

		if (!collectionRequest) {
			// throw new BusinessException('No existe una solicitud de recogida configurada con la ruta: ' + routeId, 400);
			return false;
		}

		return true;
	}
}
