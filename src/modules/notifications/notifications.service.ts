import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserContextService } from '../users/user-context.service';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { Notification } from './entities/notification.entity';
import { NotificationDto, NotificationQueryDto, NotificationUpdateDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
	constructor(
		@InjectRepository(Notification)
		private readonly notificationRepository: Repository<Notification>,
		@InjectEntityManager() private entityManager: EntityManager,
		private userContextService: UserContextService
	) { }

	async findAll({
		page,
		pageSize,
	}: NotificationQueryDto): Promise<Pagination<Notification>> {
		const queryBuilder = this.notificationRepository;

		return paginate<Notification>(queryBuilder, {
			page,
			pageSize,
		});
	}


	async findUserById(id: number): Promise<Notification | undefined> {
		const notification = await this.notificationRepository.findOne({ where: { id } });
		if (!notification) {
			throw new BusinessException('Tipo de Notificación no encontrada', 404);
		}
		return notification;
	}

	async create({ emails, ...content }: NotificationDto): Promise<Notification> {
		const user_id = this.userContextService.getUserDetails().id;

		const notification = this.notificationRepository.create({ ...content, createdBy: user_id, modifiedBy: user_id, emails: JSON.stringify(emails) });
		return await this.notificationRepository.save(notification);
	}

	async update(id: number, { emails, ...updatedData }: NotificationUpdateDto): Promise<Notification> {
		const notification = await this.notificationRepository.findOne({ where: { id } });

		if (!notification) {
			throw new BusinessException('Tipo de notificación no encontrado', 400);
		}

		updatedData = Object.assign(notification, { ...updatedData, emails: JSON.stringify(emails) });
		const modifiedBy = this.userContextService.getUserDetails().id;

		return await this.notificationRepository.save({ ...updatedData, modifiedBy });
	}
}
