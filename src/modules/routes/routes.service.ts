import { Injectable } from '@nestjs/common';
import { CreateRouteDto, UpdateRouteDto } from './dto/route.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { Repository } from 'typeorm';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { CollectionRequest } from '../collection_request/entities/collection_request.entity';
import { CollectionRequestAudit } from '../collection_request_audits/entities/collection_request_audit.entity';
import { UserContextService } from '../users/user-context.service';
import { DriversService } from '../drivers/drivers.service';
import { MailerService } from 'src/core/shared/mailer/mailer.service';


@Injectable()
export class RoutesService {
	constructor(
		@InjectRepository(Route)
		private readonly repository: Repository<Route>,
		@InjectRepository(CollectionRequest)
		private readonly collectionRequestRepository: Repository<CollectionRequest>,
		@InjectRepository(CollectionRequestAudit)
		private readonly collectionRequestAuditRepository: Repository<CollectionRequestAudit>,
		private readonly userContextService: UserContextService,
		private readonly driversService: DriversService,
		private readonly mailerService: MailerService,
	) { }

	async create(id: number, { transporter, ...dto }: CreateRouteDto): Promise<Route> {
		const collectionRequest = await this.collectionRequestRepository.findOne({
			where: { id, status: true },
			relations: ['route']
		});

		if (!collectionRequest) {
			throw new BusinessException('Solicitud no encontrada', 400);
		}

		if (collectionRequest.requestStatusId !== 1 || collectionRequest.route) {
			throw new BusinessException('La solicitud, no aplica para la acción a ejecutar', 400);
		}

		// const transporter = await this.transporterRepository.findOne({
		// 	where: { id: dto.transporterId, status: true }
		// });

		// if (!transporter) {
		// 	throw new BusinessException('Transportador no encontrada', 400);
		// }

		const user_id = this.userContextService.getUserDetails().id;

		const route = this.repository.create({ collectionRequest, ...dto, createdBy: user_id, modifiedBy: user_id });
		const routeSaved = await this.repository.save(route);

		await this.collectionRequestRepository.update(id, { transporter: null, requestStatusId: 2, createdBy: user_id, modifiedBy: user_id });
		// await this.collectionRequestRepository.update(id, { transporter, requestStatusId: 2, createdBy: user_id, modifiedBy: user_id });
		await this.driversService.create({ ...transporter, collectionRequestId: id });

		let collectionRequestAudit = this.collectionRequestAuditRepository.create({
			collectionRequest,
			name: 'ROUTE_ASSIGNMENT',
			description: 'IMPLEMENTED ROUTE',
			statusId: collectionRequest.requestStatusId || 1,
			createdBy: user_id, modifiedBy: user_id
		});

		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		collectionRequestAudit = this.collectionRequestAuditRepository.create({
			collectionRequest,
			name: 'DRIVER_ASSIGNMENT',
			description: 'IMPLEMENTED DRIVER ASSIGN',
			statusId: collectionRequest.requestStatusId || 1,
			createdBy: user_id, modifiedBy: user_id
		});

		await this.collectionRequestAuditRepository.save(collectionRequestAudit);

		return routeSaved;

		// Enviar correos
		this.mailerService.send()
	}
}
