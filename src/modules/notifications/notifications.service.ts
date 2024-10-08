import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
	// create(createNotificationDto: CreateNotificationDto) {
	// 	return 'This action adds a new notification';
	// }

	findAll() {
		return `This action returns all notifications`;
	}

	findOne(id: number) {
		return `This action returns a #${id} notification`;
	}
}
