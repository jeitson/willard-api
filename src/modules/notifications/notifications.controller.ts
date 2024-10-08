import { Controller, Get, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';

@Controller('notifications')
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) { }

	// @Get()
	// findAll() {
	// 	return this.notificationsService.findAll();
	// }

	// @Get(':id')
	// findOne(@IdParam('id') id: string) {
	// 	return this.notificationsService.findOne(+id);
	// }
}
