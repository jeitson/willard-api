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
		@InjectRepository(Transporter)
		private readonly transporterRepository: Repository<Transporter>,
	) { }

	async create(createDto: CollectionRequestCreateDto): Promise<CollectionRequest> {
		let requestStatusId = 1;
		let collectionRequest = this.collectionRequestRepository.create({ ...createDto, requestStatusId });

		const { isSpecial, pickUpLocationId, ...content } = createDto;

		if (!isSpecial) {
			const pickUpLocation = await this.pickUpLocationRepository.findOne({
				where: { id: pickUpLocationId, status: true },
				relations: ['collectionSite', 'consultant'],
			});

			if (!pickUpLocation) {
				throw new BusinessException('No existe el lugar de recogida', 400);
			}

			const transporter = await this.transporterRepository.findOneBy({ id: createDto.transporterId, status: true });

			if (!transporter) {
				throw new BusinessException('No existe la transportadora', 400);
			}

			requestStatusId = 6;

			collectionRequest = this.collectionRequestRepository.create({
				...content,
				isSpecial,
				collectionSite: pickUpLocation.collectionSite,
				consultant: pickUpLocation.consultant,
				requestStatusId,
				transporter
			});
		} else {
			collectionRequest.transporter = null;
		}

		const collectionRequestSaved = await this.collectionRequestRepository.save(collectionRequest);

		if (!collectionRequestSaved) {
			throw new BusinessException('Error en el guardado de la solicitud', 400);
		}

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({
			collectionRequest: collectionRequestSaved,
			name: 'CREATED',
			description: `CREATION - ${createDto.isSpecial ? 'SPECIAL' : 'NORMAL'}`,
			statusId: requestStatusId || 1,
		});

		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		return collectionRequestSaved;
	}


	async update(id: number, updateDto: CollectionRequestUpdateDto): Promise<void> {
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

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({ collectionRequest, name: 'UPDATED', description: 'COMPLETE INFORMATION UPDATE', statusId: 1 });
		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		await this.collectionRequestRepository.update(id, { ...collectionRequest, ...updateDto, requestStatusId: 1 });
	}

	async findAll(query: any): Promise<Pagination<CollectionRequest>> {
		const queryBuilder = this.collectionRequestRepository.createQueryBuilder('collectionRequest')
			.leftJoinAndSelect('collectionRequest.client', 'client')
			.leftJoinAndSelect('collectionRequest.pickUpLocation', 'pickUpLocation')
			.leftJoinAndSelect('collectionRequest.collectionSite', 'collectionSite')
			.leftJoinAndSelect('collectionRequest.transporter', 'transporter')
			.leftJoinAndSelect('collectionRequest.consultant', 'consultant')
			.leftJoinAndSelect('collectionRequest.audits', 'audits')
			.leftJoinAndSelect('collectionRequest.route', 'route');

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

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({ collectionRequest, name: 'REJECTED', description: '', statusId: 3 });
		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		await this.collectionRequestRepository.update(id, { requestStatusId: 3, collectionSite: null, consultant: null, transporter: null, isSpecial: true });
	}

	async approve(id: number): Promise<void> {
		const collectionRequest = await this.collectionRequestRepository.findOne({ where: { id, status: true } });
		if (!collectionRequest) {
			throw new BusinessException('Solicitud no encontrada', 404);
		}

		if (collectionRequest.requestStatusId !== 1) {
			throw new BusinessException('El estado actual de la solicitud, no permite la acción a ejecutar', 400);
		}

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({ collectionRequest, name: 'APPROVED', description: '', statusId: 2 });
		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		await this.collectionRequestRepository.update(id, { requestStatusId: 2 });
	}

	async cancel(id: number): Promise<void> {
		const collectionRequest = await this.collectionRequestRepository.findOne({ where: { id, status: true } });
		if (!collectionRequest) {
			throw new BusinessException('Solicitud no encontrada', 404);
		}

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({ collectionRequest, name: 'CANCELLED', description: '', statusId: 4 });
		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		await this.collectionRequestRepository.update(id, { requestStatusId: 4 });
	}

	async delete(id: number): Promise<void> {
		const collectionRequest = await this.collectionRequestRepository.findOne({ where: { id, status: true } });
		if (!collectionRequest) {
			throw new BusinessException('Solicitud no encontrada', 404);
		}

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({ collectionRequest, name: 'DELETED', description: '', statusId: 5 });
		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		await this.collectionRequestRepository.update(id, { status: false });
	}
}
