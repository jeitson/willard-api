import { Injectable } from '@nestjs/common';
import { CreateRouteDto, UpdateRouteDto } from './dto/route.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { DataSource, Repository } from 'typeorm';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { CollectionRequest } from '../collection_request/entities/collection_request.entity';
import { CollectionRequestAudit } from '../collection_request_audits/entities/collection_request_audit.entity';
import { UserContextService } from '../users/user-context.service';
import { DriversService } from '../drivers/drivers.service';
import { MailerService } from 'src/core/shared/mailer/mailer.service';
import { validateEmail } from 'src/core/utils';
import { NotificationsService } from '../notifications/notifications.service';


@Injectable()
export class RoutesService {

	constructor(
		@InjectRepository(Route)
		private readonly routeRepository: Repository<Route>,
		private readonly userContextService: UserContextService,
		private readonly driversService: DriversService,
		private readonly mailerService: MailerService,
		private readonly notificationsService: NotificationsService,
		private readonly dataSource: DataSource
	) { }

	async create(id: number, { transporter, ...dto }: CreateRouteDto): Promise<Route> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.startTransaction();

		try {
			const collectionRequest = await queryRunner.manager.findOne(CollectionRequest, {
				where: { id, status: true },
				relations: ['route', 'user', 'pickUpLocation', 'pickUpLocation.user']
			});

			if (!collectionRequest) {
				throw new BusinessException('Solicitud no encontrada', 400);
			}

			if (collectionRequest.requestStatusId !== 1 || collectionRequest.route) {
				throw new BusinessException('La solicitud no aplica para la acción a ejecutar', 400);
			}

			const userId = this.userContextService.getUserDetails().id;

			const route = this.routeRepository.create({ collectionRequest, ...dto, createdBy: userId, modifiedBy: userId });
			const routeSaved = await queryRunner.manager.save(Route, route);

			await queryRunner.manager.update(CollectionRequest, id, { transporter: null, requestStatusId: 2, createdBy: userId, modifiedBy: userId });

			await this.driversService.create({ ...transporter, collectionRequestId: id });

			const auditEntries = [
				{
					collectionRequest,
					name: 'ROUTE_ASSIGNMENT',
					description: 'IMPLEMENTED ROUTE',
					statusId: collectionRequest.requestStatusId || 1,
					createdBy: userId,
					modifiedBy: userId
				},
				{
					collectionRequest,
					name: 'DRIVER_ASSIGNMENT',
					description: 'IMPLEMENTED DRIVER ASSIGN',
					statusId: collectionRequest.requestStatusId || 1,
					createdBy: userId,
					modifiedBy: userId
				}
			];

			const mailConfig = await this.notificationsService.findOne(1);

			if (!mailConfig) {
				throw new BusinessException('No hay configuración de correos para este proceso', 400);
			}

			let { emails, subject, template } = mailConfig;

			const { user: { email }, pickUpLocation: { contactEmail, user: { email: pickUpLocationEmail } } } = collectionRequest;

			emails = typeof emails === 'string' ? JSON.parse(emails) : emails;

			const allEmails = [email, contactEmail, pickUpLocationEmail, ...emails].filter(validateEmail);

			const mailPromises = allEmails.map(recipient =>
				this.mailerService.send({ to: [recipient], type: 'html', content: template, subject })
			);

			await Promise.all(mailPromises);

			auditEntries.push({
				collectionRequest,
				name: 'MAIL_SENT',
				description: 'NOTIFICATION BY MAIL',
				statusId: collectionRequest.requestStatusId || 1,
				createdBy: userId,
				modifiedBy: userId
			});

			await queryRunner.manager.save(CollectionRequestAudit, auditEntries);

			await queryRunner.commitTransaction();
			return routeSaved;

		} catch (error) {
			await queryRunner.rollbackTransaction();
			console.error('Error en la creación de la ruta o envío de correos:', error);
			throw new BusinessException('Error al procesar la solicitud', 500);

		} finally {
			await queryRunner.release();
		}
	}

}
