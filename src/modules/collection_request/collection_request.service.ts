import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { BusinessException } from "src/core/common/exceptions/biz.exception";
import { Pagination } from "src/core/helper/paginate/pagination";
import { paginate } from "src/core/helper/paginate";
import { CollectionRequest } from "./entities/collection_request.entity";
import { CollectionRequestCompleteDto, CollectionRequestCreateDto, CollectionRequestRouteInfoDto, CollectionRequestRouteList, CollectionRequestUpdateDto } from "./dto/collection_request.dto";
import { PickUpLocation } from "../pick_up_location/entities/pick_up_location.entity";
import { CollectionRequestAudit } from "../collection_request_audits/entities/collection_request_audit.entity";
import { Transporter } from "../transporters/entities/transporter.entity";
import { CollectionSite } from "../collection_sites/entities/collection_site.entity";
import { Client } from "../clients/entities/client.entity";
import { UserContextService } from "../users/user-context.service";
import { User } from "../users/entities/user.entity";
import { Child } from "../catalogs/entities/child.entity";
import { REQUEST_STATUS } from "src/core/constants/status.constant";
import { ROL } from "src/core/constants/rol.constant";
import { Product } from "../products/entities/product.entity";

@Injectable()
export class CollectionRequestService {
	constructor(
		@InjectRepository(CollectionRequest)
		private readonly collectionRequestRepository: Repository<CollectionRequest>,
		@InjectRepository(PickUpLocation)
		private readonly pickUpLocationRepository: Repository<PickUpLocation>,
		@InjectRepository(CollectionRequestAudit)
		private readonly collectionRequestAuditRepository: Repository<CollectionRequestAudit>,
		@InjectRepository(CollectionSite)
		private readonly collectionSiteRepository: Repository<CollectionSite>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Transporter)
		private readonly transporterRepository: Repository<Transporter>,
		@InjectRepository(Client)
		private readonly clientRepository: Repository<Client>,
		@InjectRepository(Child)
		private readonly childRepository: Repository<Child>,
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,
		private readonly userContextService: UserContextService
	) { }

	async create(createDto: CollectionRequestCreateDto): Promise<CollectionRequest> {
		let { isSpecial, pickUpLocationId, products: _products, ...content } = createDto;

		const { id: user_id, roles } = this.userContextService.getUserDetails();

		const isFactory = roles.map(({ roleId }) => +roleId).includes(ROL.FABRICA_BW);

		isSpecial = isFactory ? true : isSpecial;

		const client = await this.clientRepository.findOneBy({ id: createDto.clientId })

		if (!client) {
			throw new BusinessException('El cliente no existe', 400);
		}

		const products = await this.productRepository.findBy({ id: In(_products), status: true })

		if (products.length !== createDto.products.length) {
			throw new BusinessException('Algún producto ingresado, no se encuentra configurado', 400);
		}

		const pickUpLocation = await this.pickUpLocationRepository.findOne({
			where: { id: pickUpLocationId, status: true },
			relations: ['collectionSite', 'user'],
		});

		if (!pickUpLocation) {
			throw new BusinessException('No existe el lugar de recogida', 400);
		}

		let requestStatusId = REQUEST_STATUS.PENDING;
		let collectionRequest = this.collectionRequestRepository.create({ ...createDto, requestStatusId, client, pickUpLocation, products });

		if (isSpecial) {
			const motiveSpecial = await this.childRepository.findOneBy({ id: +createDto.motiveSpecialId, catalogCode: 'MOTIVO_ESPECIAL' })

			if (!motiveSpecial) {
				throw new BusinessException('El motivo especial no existe', 400);
			}

			requestStatusId = REQUEST_STATUS.INCOMPLETE;
		} else {
			const transporter = await this.transporterRepository.findOneBy({ id: +createDto.transporterId })

			if (!transporter) {
				throw new BusinessException('La transportadora no existe', 400);
			}

			collectionRequest = this.collectionRequestRepository.create({
				...content,
				isSpecial,
				collectionSite: pickUpLocation.collectionSite,
				user: pickUpLocation.user,
				requestStatusId,
				pickUpLocation,
				client,
				transporter,
				products
			});
		}

		const collectionRequestSaved = await this.collectionRequestRepository.save({ ...collectionRequest, requestStatusId, createdBy: user_id, modifiedBy: user_id });

		if (!collectionRequestSaved) {
			throw new BusinessException('Error en el guardado de la solicitud', 400);
		}

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({
			collectionRequest: collectionRequestSaved,
			name: 'CREATED',
			description: `CREATION - ${createDto.isSpecial ? 'SPECIAL' : 'NORMAL'}`,
			statusId: requestStatusId || REQUEST_STATUS.PENDING,
			createdBy: user_id, modifiedBy: user_id
		});

		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		return collectionRequestSaved;
	}

	async update(id: number, updatedDto: CollectionRequestUpdateDto): Promise<CollectionRequest> {
		let collectionRequest: any = await this.collectionRequestRepository.findOne({ where: { id, status: true } });

		if (!collectionRequest) {
			throw new BusinessException('Solicitud no encontrada', 404);
		}

		if (collectionRequest.requestStatusId === REQUEST_STATUS.CONFIRMED) {
			throw new BusinessException('La solicitud no puede ser actualizada, ya fue confirmada', 400);
		}

		const { id: user_id } = this.userContextService.getUserDetails();

		const client = await this.clientRepository.findOneBy({ id: updatedDto.clientId });
		if (!client) {
			throw new BusinessException('El cliente no existe', 400);
		}

		const products = await this.productRepository.findBy({ id: In(updatedDto.products), status: true })

		if (products.length !== updatedDto.products.length) {
			throw new BusinessException('Algún producto ingresado, no se encuentra configurado', 400);
		}

		let requestStatusId = REQUEST_STATUS.PENDING, pickUpLocation = null, transporter = null;

		pickUpLocation = await this.pickUpLocationRepository.findOne({
			where: { id: updatedDto.pickUpLocationId, status: true },
			relations: ['collectionSite', 'user'],
		});

		if (!pickUpLocation) {
			throw new BusinessException('No existe el lugar de recogida', 400);
		}

		if (collectionRequest.isSpecial) {
			const motiveSpecial = await this.childRepository.findOneBy({ id: +updatedDto.motiveSpecialId, catalogCode: 'MOTIVO_ESPECIAL' });
			if (!motiveSpecial) {
				throw new BusinessException('El motivo especial no existe', 400);
			}

			requestStatusId = REQUEST_STATUS.INCOMPLETE;
		} else {
			transporter = await this.transporterRepository.findOneBy({ id: +updatedDto.transporterId })

			if (!transporter) {
				throw new BusinessException('La transportadora no existe', 400);
			}
		}

		collectionRequest = {
			...collectionRequest,
			...updatedDto,
			requestStatusId,
			client,
			pickUpLocation,
			collectionSite: pickUpLocation.collectionSite,
			transporter,
			user: pickUpLocation.user,
			modifiedBy: user_id,
			products,
		};

		const collectionRequestSaved = await this.collectionRequestRepository.save(collectionRequest);

		if (!collectionRequestSaved) {
			throw new BusinessException('Error en el guardado de la solicitud', 400);
		}

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({
			collectionRequest: collectionRequestSaved,
			name: 'UPDATED',
			description: `UPDATED - ${collectionRequest.isSpecial ? 'SPECIAL' : 'NORMAL'}`,
			statusId: requestStatusId,
			createdBy: user_id,
			modifiedBy: user_id
		});

		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		return collectionRequestSaved;
	}

	async completeInfo(id: number, { collectionSiteId, consultantId, transporterId }: CollectionRequestCompleteDto): Promise<void> {
		const collectionRequest = await this.collectionRequestRepository.findOne({ where: { id, status: true } });

		if (!collectionRequest) {
			throw new BusinessException('Solicitud no encontrada', 404);
		}

		if (!collectionRequest.isSpecial) {
			throw new BusinessException('La configuración de la solicitud, no permite la acción a ejecutar', 400);
		}

		if (collectionRequest.requestStatusId !== REQUEST_STATUS.INCOMPLETE) {
			throw new BusinessException('El estado actual de la solicitud, no permite la acción a ejecutar', 400);
		}

		const collectionSite = await this.collectionSiteRepository.findOneBy({ id: +collectionSiteId });

		if (!collectionSite) {
			throw new BusinessException(`Centro de acopio no encontrado`, 400);
		}

		const user = await this.userRepository.findOneBy({ id: +consultantId });

		if (!user) {
			throw new BusinessException(`Asesor no encontrado`, 400);
		}

		const transporter = await this.transporterRepository.findOneBy({ id: +transporterId });

		if (!transporter) {
			throw new BusinessException(`Transportadora no encontrado`, 400);
		}

		const user_id = this.userContextService.getUserDetails().id;

		const updated = await this.collectionRequestRepository.update(id, { ...collectionRequest, collectionSite, user, transporter, requestStatusId: REQUEST_STATUS.PENDING, modifiedBy: user_id });

		if (!updated) {
			throw new BusinessException('No se pudó actualizar la información', 400);
		}

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({ collectionRequest, name: 'UPDATED', description: 'COMPLETE INFORMATION UPDATE', modifiedBy: user_id, statusId: REQUEST_STATUS.PENDING, createdBy: user_id });
		await this.collectionRequestAuditRepository.save(collectionRequestAudit);
	}

	private createBaseQueryBuilder() {
		return this.collectionRequestRepository.createQueryBuilder('collectionRequest')
			.leftJoinAndSelect('collectionRequest.client', 'client')
			.leftJoinAndSelect('collectionRequest.pickUpLocation', 'pickUpLocation')
			.leftJoinAndSelect('collectionRequest.collectionSite', 'collectionSite')
			.leftJoinAndSelect('collectionRequest.driver', 'driver')
			.leftJoinAndSelect('collectionRequest.transporter', 'transporter')
			.leftJoinAndSelect('collectionRequest.user', 'user')
			.leftJoinAndSelect('collectionRequest.audits', 'audits')
			.leftJoinAndSelect('collectionRequest.route', 'route')
			.leftJoinAndSelect('collectionRequest.product', 'product')
			.leftJoinAndMapOne('collectionRequest.requestStatusId', Child, 'requestStatus', 'requestStatus.id = collectionRequest.requestStatusId')
			.leftJoinAndMapOne('collectionSite.cityId', Child, 'city', 'city.id = collectionSite.cityId')
			.leftJoinAndMapOne('pickUpLocation.zoneId', Child, 'zone', 'zone.id = pickUpLocation.zoneId');
	}

	async findAll(query: any): Promise<Pagination<CollectionRequest>> {
		const queryBuilder = this.createBaseQueryBuilder();


		let { roles, id, zones } = this.userContextService.getUserDetails();
		roles = roles.map(({ roleId }) => +roleId);
		zones = zones.map(({ zoneId }) => +zoneId);

		if (roles.find((role: number) => [ROL.ASESOR_PH, ROL.FABRICA_BW, ROL.AGENCIA_PH].includes(role))) {
			queryBuilder.where('collectionRequest.createdBy = :id', { id });
		}

		if (roles.includes(ROL.PLANEADOR_TRANSPORTE)) {

			if (zones.length === 0) {
				throw new BusinessException('El usuario no tiene zonas configuradas', 400);
			}

			queryBuilder.where('collectionRequest.requestStatusId = :status', { status: REQUEST_STATUS.PENDING })

			if (zones.length > 0) {
				queryBuilder.andWhere('zone.id IN (:...zones)', { zones });
			}
		}

		if (roles.includes(ROL.WILLARD_LOGISTICA)) {
			queryBuilder.where('collectionRequest.isSpecial = :status', { status: true })
			.andWhere('collectionRequest.requestStatusId = :request_status', { request_status: REQUEST_STATUS.INCOMPLETE });
		}

		return paginate<CollectionRequest>(queryBuilder, {
			page: query.page,
			pageSize: query.pageSize,
		});
	}

	async findOne(id: number): Promise<CollectionRequest> {
		const collectionRequest = this.createBaseQueryBuilder().where('collectionRequest.id = :id', { id }).getOne();

		if (!collectionRequest) {
			throw new BusinessException('Solicitud no encontrada', 404);
		}

		return collectionRequest;
	}

	async reject(id: number): Promise<void> {
		const collectionRequest = await this.collectionRequestRepository.findOne({ where: { id, status: true } });
		if (!collectionRequest) {
			throw new BusinessException('Solicitud no encontrada', 404);
		}

		if (collectionRequest.requestStatusId !== REQUEST_STATUS.PENDING) {
			throw new BusinessException('El estado actual de la solicitud, no permite la acción a ejecutar', 400);
		}

		const user_id = this.userContextService.getUserDetails().id;

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({ collectionRequest, name: 'REJECTED', description: '', statusId: REQUEST_STATUS.INCOMPLETE, createdBy: user_id, modifiedBy: user_id });
		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		await this.collectionRequestRepository.update(id, { requestStatusId: REQUEST_STATUS.INCOMPLETE, collectionSite: null, user: null, transporter: null, isSpecial: true, modifiedBy: user_id });
	}

	async approve(id: number): Promise<void> {
		const collectionRequest = await this.collectionRequestRepository.findOne({ where: { id, status: true } });
		if (!collectionRequest) {
			throw new BusinessException('Solicitud no encontrada', 404);
		}

		if (collectionRequest.requestStatusId !== REQUEST_STATUS.PENDING) {
			throw new BusinessException('El estado actual de la solicitud, no permite la acción a ejecutar', 400);
		}

		const user_id = this.userContextService.getUserDetails().id;

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({ collectionRequest, name: 'APPROVED', description: '', statusId: REQUEST_STATUS.CONFIRMED, createdBy: user_id, modifiedBy: user_id });
		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		await this.collectionRequestRepository.update(id, { requestStatusId: 2, modifiedBy: user_id });
	}

	async cancel(id: number): Promise<void> {
		const collectionRequest = await this.collectionRequestRepository.findOne({ where: { id, status: true } });
		if (!collectionRequest) {
			throw new BusinessException('Solicitud no encontrada', 404);
		}

		const user_id = this.userContextService.getUserDetails().id;

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({ collectionRequest, name: 'CANCELLED', description: '', statusId: REQUEST_STATUS.CANCELLED, createdBy: user_id, modifiedBy: user_id });
		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		await this.collectionRequestRepository.update(id, { requestStatusId: REQUEST_STATUS.CANCELLED, modifiedBy: user_id });
	}

	async delete(id: number): Promise<void> {
		const collectionRequest = await this.collectionRequestRepository.findOne({ where: { id, status: true } });
		if (!collectionRequest) {
			throw new BusinessException('Solicitud no encontrada', 404);
		}

		const user_id = this.userContextService.getUserDetails().id;

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({ collectionRequest, name: 'DELETED', description: '', statusId: REQUEST_STATUS.FOLLOW_UP, createdBy: user_id, modifiedBy: user_id });
		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		await this.collectionRequestRepository.update(id, { status: false, modifiedBy: user_id });
	}

	async findAllRoutePendingUpload(): Promise<CollectionRequest[]> {
		const queryBuilder = this.collectionRequestRepository.createQueryBuilder('collectionRequest')
			.leftJoinAndSelect('collectionRequest.pickUpLocation', 'pickUpLocation')
			.leftJoinAndMapOne('pickUpLocation.zoneId', Child, 'zone', 'zone.id = pickUpLocation.zoneId');

		let { zones } = this.userContextService.getUserDetails();
		zones = zones.map(({ zoneId }) => +zoneId);

		if (zones.length === 0) {
			throw new BusinessException('El usuario no tiene zonas configuradas', 400);
		}

		queryBuilder.where('collectionRequest.requestStatusId = :status', { status: REQUEST_STATUS.CONFIRMED })
		queryBuilder.andWhere('zone.id IN (:...zones)', { zones })

		return queryBuilder.getMany();
	}

	async getRouteInfoPendingUpload({ routes }: CollectionRequestRouteInfoDto): Promise<CollectionRequestRouteList[]> {
		let { zones } = this.userContextService.getUserDetails();
		zones = zones.map(({ zoneId }) => +zoneId);

		if (zones.length === 0) {
			throw new BusinessException('El usuario no tiene zonas configuradas', 400);
		}

		const queryBuilder = this.collectionRequestRepository.createQueryBuilder('collectionRequest')
			.leftJoinAndSelect('collectionRequest.pickUpLocation', 'pickUpLocation')
			.leftJoinAndSelect('collectionRequest.user', 'user')
			.leftJoinAndSelect('collectionRequest.route', 'route')
			.leftJoinAndSelect('collectionRequest.driver', 'driver')
			.leftJoinAndSelect('collectionRequest.collectionSite', 'collectionSite')
			.leftJoinAndMapOne('pickUpLocation.zone', Child, 'zone', 'zone.id = pickUpLocation.zoneId')
			.leftJoinAndMapOne('pickUpLocation.city', Child, 'city', 'city.id = pickUpLocation.cityId');

		queryBuilder.where('collectionRequest.requestStatusId = :status', { status: REQUEST_STATUS.CONFIRMED })
		.andWhere('zone.id IN (:...zones) AND collectionRequest.routeId IN (:...routes)', { zones, routes });

		const results = await queryBuilder.getMany();

		if (results.length === 0) {
			throw new BusinessException('La información enviada, no aplica para la generación de la información', 400);
		}

		return results.map((element) => {
			return {
				idRuta: element.routeId,
				idGuia: '',
				// TODO: consultar el tipo de movimiento
				tipo: '',
				// TODO: ¿Qué es secuencia?
				secuencia: '',
				fechaMov: element.requestDate,
				horaMov: element.requestTime,
				planeador: element.user?.id,
				zona: (element.pickUpLocation as any).zone.name,
				ciudad: (element.pickUpLocation as any).city?.name,
				// TODO: buscar el departamento de la ciudad
				depto: '',
				placa: element.route.plate,
				conductor: element.driver.name,
				nombreSitio: element.collectionSite.name,
				direccion: element.collectionSite.address,
				// TODO: ¿Qué es posGps?
				posGps: '',
				totCant: element.estimatedQuantity,
				// TODO: ¿Qué es docReferencia?
				docReferencia: '',
				// TODO: ¿Qué es docReferencia2?
				docReferencia2: '',
				urlSoportes: '',
				detalles: '',
			}
		});
	}
}
