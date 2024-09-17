import { Injectable } from '@nestjs/common';
import { CreateRouteDto, UpdateRouteDto } from './dto/route.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { Repository } from 'typeorm';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { CollectionRequest } from '../collection_request/entities/collection_request.entity';
import { CollectionRequestAudit } from '../collection_request_audits/entities/collection_request_audit.entity';
import { Transporter } from '../transporters/entities/transporter.entity';

@Injectable()
export class RoutesService {
	constructor(
		@InjectRepository(Route)
		private readonly repository: Repository<Route>,
		@InjectRepository(CollectionRequest)
		private readonly collectionRequestRepository: Repository<CollectionRequest>,
		@InjectRepository(CollectionRequestAudit)
		private readonly collectionRequestAuditRepository: Repository<CollectionRequestAudit>,
		@InjectRepository(Transporter)
		private readonly transporterRepository: Repository<Transporter>,
	) { }

	async create(id: number, dto: CreateRouteDto): Promise<Route> {
		const collectionRequest = await this.collectionRequestRepository.findOne({
			where: { id, status: true }
		});

		if (!collectionRequest) {
			throw new BusinessException('Solicitud no encontrada', 400);
		}

		if (collectionRequest.requestStatusId !== 1 || collectionRequest.route) {
			throw new BusinessException('La solicitud, no aplica para la acción a ejecutar', 400);
		}

		const transporter = await this.transporterRepository.findOne({
			where: { id: dto.transporterId, status: true }
		});

		if (!transporter) {
			throw new BusinessException('Transportador no encontrada', 400);
		}

		const route = this.repository.create({ collectionRequest, ...dto });
		const routeSaved = await this.repository.save(route);

		await this.collectionRequestRepository.update(id, { transporter });

		const collectionRequestAudit = this.collectionRequestAuditRepository.create({
			collectionRequest,
			name: 'ROUTE_ASSIGNMENT',
			description: 'IMPLEMENTED ROUTE',
			statusId: collectionRequest.requestStatusId || 1,
		});

		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		return routeSaved;
	}

	async findOne(id: number): Promise<Route> {
		const entity = await this.repository.findOne({ where: { id } });
		if (!entity) {
			throw new BusinessException('Ruta no encontrada');
		}
		return entity;
	}

	async update(id: number, dto: UpdateRouteDto): Promise<Route> {
		const entity = await this.repository.preload({
			id,
			...dto,
		});

		if (!entity) {
			throw new BusinessException('Ruta no encontrada');
		}

		return await this.repository.save(entity);
	}

	async findAll(query): Promise<Route[]> {
		return await this.repository.find({
			where: query,
		});
	}

	async remove(id: number): Promise<void> {
		const result = await this.repository.delete(id);
		if (result.affected === 0) {
			throw new BusinessException('Ruta no encontrada');
		}
	}
}
