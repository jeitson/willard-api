import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BusinessException } from "src/core/common/exceptions/biz.exception";
import { Pagination } from "src/core/helper/paginate/pagination";
import { paginate } from "src/core/helper/paginate";
import { CollectionRequest } from "./entities/collection_request.entity";
import { CollectionRequestCreateDto, CollectionRequestUpdateDto } from "./dto/collection_request.dto";
import { PickUpLocation } from "../pick_up_location/entities/pick_up_location.entity";
import { CollectionRequestAudit } from "../collection_request_audits/entities/collection_request_audit.entity";
import { Transporter } from "../transporters/entities/transporter.entity";
import { CollectionSite } from "../collection_sites/entities/collection_site.entity";
import { Consultant } from "../consultants/entities/consultant.entity";
import { Client } from "../clients/entities/client.entity";
import { UserContextService } from "../users/user-context.service";

/** Estados ID
 * 1 = Pendiente
 * 2 = Confirmado
 * 3 = Rechazado
 * 4 = Cancelado
 * 5 = Seguimiento
 * 6 = Incompleta
 *  **/


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
		@InjectRepository(Consultant)
		private readonly consultantRepository: Repository<Consultant>,
		@InjectRepository(Transporter)
		private readonly transporterRepository: Repository<Transporter>,
		@InjectRepository(Client)
		private readonly clientRepository: Repository<Client>,
		private readonly userContextService: UserContextService
	) { }

	async create(createDto: CollectionRequestCreateDto): Promise<CollectionRequest> {
		const { isSpecial, pickUpLocationId, ...content } = createDto;

		const client = await this.clientRepository.findOneBy({ id: createDto.clientId })

		if (!client) {
			throw new BusinessException('El cliente no existe', 400);
		}

		const pickUpLocation = await this.pickUpLocationRepository.findOne({
			where: { id: pickUpLocationId, status: true },
			relations: ['collectionSite', 'consultant'],
		});

		if (!pickUpLocation) {
			throw new BusinessException('No existe el lugar de recogida', 400);
		}

		let requestStatusId = 1;
		let collectionRequest = this.collectionRequestRepository.create({ ...createDto, requestStatusId, client, pickUpLocation });

		if (isSpecial) {
			requestStatusId = 6;
		} else {
			collectionRequest = this.collectionRequestRepository.create({
				...content,
				isSpecial,
				collectionSite: pickUpLocation.collectionSite,
				consultant: pickUpLocation.consultant,
				requestStatusId,
				pickUpLocation,
				client,
			});
		}

		const user_id = this.userContextService.getUserDetails().id;

		const collectionRequestSaved = await this.collectionRequestRepository.save({ requestStatusId, ...collectionRequest, createdBy: user_id, modifiedBy: user_id });

		if (!collectionRequestSaved) {
			throw new BusinessException('Error en el guardado de la solicitud', 400);
		}

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({
			collectionRequest: collectionRequestSaved,
			name: 'CREATED',
			description: `CREATION - ${createDto.isSpecial ? 'SPECIAL' : 'NORMAL'}`,
			statusId: requestStatusId || 1,
			createdBy: user_id, modifiedBy: user_id
		});

		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		return collectionRequestSaved;
	}

	async update(id: number, createDto: CollectionRequestCreateDto): Promise<CollectionRequest> {
		let collectionRequest = await this.collectionRequestRepository.findOne({ where: { id, status: true } });

		if (!collectionRequest) {
			throw new BusinessException('Solicitud no encontrada', 404);
		}

		let requestStatusId = 1;

		const { isSpecial, pickUpLocationId, ...content } = createDto;

		if (!isSpecial) {
			const pickUpLocation = await this.pickUpLocationRepository.findOne({
				where: { id: pickUpLocationId, status: true },
				relations: ['collectionSite', 'consultant'],
			});

			if (!pickUpLocation) {
				throw new BusinessException('No existe el lugar de recogida', 400);
			}

			collectionRequest = this.collectionRequestRepository.create({
				...content,
				isSpecial,
				collectionSite: pickUpLocation.collectionSite,
				consultant: pickUpLocation.consultant,
				requestStatusId,
			});
		} else {
			requestStatusId = 6;
		}

		const user_id = this.userContextService.getUserDetails().id;

		const collectionRequestSaved = await this.collectionRequestRepository.update(id, { ...collectionRequest, modifiedBy: user_id });

		if (!collectionRequestSaved) {
			throw new BusinessException('Error en el guardado de la solicitud', 400);
		}

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({
			collectionRequest,
			name: 'UPDATED',
			description: `UPDATED - ${createDto.isSpecial ? 'SPECIAL' : 'NORMAL'}`,
			statusId: requestStatusId || 1,
			createdBy: user_id, modifiedBy: user_id
		});

		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		return collectionRequest;
	}

	async completeInfo(id: number, { collectionSiteId, consultantId, transporterId }: CollectionRequestUpdateDto): Promise<void> {
		const collectionRequest = await this.collectionRequestRepository.findOne({ where: { id, status: true } });

		if (!collectionRequest) {
			throw new BusinessException('Solicitud no encontrada', 404);
		}

		if (!collectionRequest.isSpecial) {
			throw new BusinessException('La configuración de la solicitud, no permite la acción a ejecutar', 400);
		}

		if (collectionRequest.requestStatusId !== 6) {
			throw new BusinessException('El estado actual de la solicitud, no permite la acción a ejecutar', 400);
		}

		const collectionSite = await this.collectionSiteRepository.findOneBy({ id: +collectionSiteId });

		if (!collectionSite) {
			throw new BusinessException(`Centro de acopio no encontrado`, 400);
		}

		const consultant = await this.consultantRepository.findOneBy({ id: +consultantId });

		if (!consultant) {
			throw new BusinessException(`Asesor no encontrado`, 400);
		}

		const transporter = await this.transporterRepository.findOneBy({ id: +transporterId });

		if (!transporter) {
			throw new BusinessException(`Transportadora no encontrado`, 400);
		}

		const user_id = this.userContextService.getUserDetails().id;

		const updated = await this.collectionRequestRepository.update(id, { ...collectionRequest, collectionSite, consultant, transporter, requestStatusId: 1, modifiedBy: user_id });

		if (!updated) {
			throw new BusinessException('No se pudó actualizar la información', 400);
		}

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({ collectionRequest, name: 'UPDATED', description: 'COMPLETE INFORMATION UPDATE', statusId: 1, modifiedBy: user_id });
		await this.collectionRequestAuditRepository.save(collectionRequestAudit);
	}

	async findAll(query: any): Promise<Pagination<CollectionRequest>> {
		const queryBuilder = this.collectionRequestRepository.createQueryBuilder('collectionRequest')
			.leftJoinAndSelect('collectionRequest.client', 'client')
			.leftJoinAndSelect('collectionRequest.pickUpLocation', 'pickUpLocation')
			.leftJoinAndSelect('collectionRequest.collectionSite', 'collectionSite')
			.leftJoinAndSelect('collectionRequest.transporter', 'transporter')
			.leftJoinAndSelect('collectionRequest.consultant', 'consultant')
			.leftJoinAndSelect('collectionRequest.audits', 'audits')
			.leftJoinAndSelect('collectionRequest.route', 'route')
			.leftJoin('usuario', 'user', 'user.email = consultant.email');


		// 1 => ROL PH Asesor
		// 2 => ROL Planeador
		// 3 => ROL Willard Logistica
		if (!query.rol || isNaN(query.rol)) {
			throw new BusinessException('Ingrese el rol', 400);
		}

		// const role = +query.rol;

		// if (role === 1) {
		// 	// Usuario ID 33 usado para simular un creador de solicitudes
		// 	queryBuilder.where('collectionRequest.createdBy = 33');
		// }

		// if (role === 2) {
		// 	queryBuilder.where('collectionRequest.requestStatusId IN (1, 2)');
		// }

		// if (role === 3) {
		// 	// Usuario ID 34 usado para simular un asesor - usuario
		// 	queryBuilder.where('collectionRequest.requestStatusId = 6');
		// 	queryBuilder.where('user.id = 34');
		// }

		return paginate<CollectionRequest>(queryBuilder, {
			page: query.page,
			pageSize: query.pageSize,
		});
	}

	async findOne(id: number): Promise<CollectionRequest> {
		const collectionRequest = await this.collectionRequestRepository.findOne({
			where: { id, status: true },
			relations: [
				'client',
				'pickUpLocation',
				'collectionSite',
				'transporter',
				'consultant',
				'audits',
				'route',
			],
		});

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

		if (collectionRequest.requestStatusId !== 1) {
			throw new BusinessException('El estado actual de la solicitud, no permite la acción a ejecutar', 400);
		}

		const user_id = this.userContextService.getUserDetails().id;

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({ collectionRequest, name: 'REJECTED', description: '', statusId: 3, createdBy: user_id, modifiedBy: user_id });
		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		await this.collectionRequestRepository.update(id, { requestStatusId: 3, collectionSite: null, consultant: null, transporter: null, isSpecial: true, modifiedBy: user_id });
	}

	async approve(id: number): Promise<void> {
		const collectionRequest = await this.collectionRequestRepository.findOne({ where: { id, status: true } });
		if (!collectionRequest) {
			throw new BusinessException('Solicitud no encontrada', 404);
		}

		if (collectionRequest.requestStatusId !== 1) {
			throw new BusinessException('El estado actual de la solicitud, no permite la acción a ejecutar', 400);
		}

		const user_id = this.userContextService.getUserDetails().id;

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({ collectionRequest, name: 'APPROVED', description: '', statusId: 2, createdBy: user_id, modifiedBy: user_id });
		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		await this.collectionRequestRepository.update(id, { requestStatusId: 2, modifiedBy: user_id });
	}

	async cancel(id: number): Promise<void> {
		const collectionRequest = await this.collectionRequestRepository.findOne({ where: { id, status: true } });
		if (!collectionRequest) {
			throw new BusinessException('Solicitud no encontrada', 404);
		}

		const user_id = this.userContextService.getUserDetails().id;

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({ collectionRequest, name: 'CANCELLED', description: '', statusId: 4, createdBy: user_id, modifiedBy: user_id });
		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		await this.collectionRequestRepository.update(id, { requestStatusId: 4, modifiedBy: user_id });
	}

	async delete(id: number): Promise<void> {
		const collectionRequest = await this.collectionRequestRepository.findOne({ where: { id, status: true } });
		if (!collectionRequest) {
			throw new BusinessException('Solicitud no encontrada', 404);
		}

		const user_id = this.userContextService.getUserDetails().id;

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({ collectionRequest, name: 'DELETED', description: '', statusId: 5, createdBy: user_id, modifiedBy: user_id });
		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		await this.collectionRequestRepository.update(id, { status: false, modifiedBy: user_id });
	}
}
