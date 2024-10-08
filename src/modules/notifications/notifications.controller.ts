import { Body, Controller, Get, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/common/decorators/role.decorator';
import { NotificationDto, NotificationQueryDto, NotificationUpdateDto } from './dto/notification.dto';
import { Notification } from './entities/notification.entity';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';

@ApiTags('Sistema - Notificaciones')
@UseGuards(RolesGuard)
@Controller('notifications')
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) { }

	@Post()
	@Roles(0)
	@ApiOperation({ summary: 'Creación de tipos de notificación' })
	create(@Body() createProductDto: NotificationDto): Promise<Notification> {
		return this.notificationsService.create(createProductDto);
	}

	@Get()
	@Roles(0)
	@ApiOperation({ summary: 'Obtener listado de tipos de notificación - Paginación' })
	@ApiResult({ type: [Notification], isPage: true })
	async findAll(@Query() dto: NotificationQueryDto) {
		return this.notificationsService.findAll(dto);
	}

	@Get(':id')
	@Roles(0)
	@ApiOperation({ summary: 'Obtener tipo de notificación por su ID' })
	findOne(@IdParam('id') id: string): Promise<Notification> {
		return this.notificationsService.findOne(+id);
	}

	@Put(':id')
	@Roles(0)
	@ApiOperation({ summary: 'Actualizar tipo de notificación' })
	async update(@IdParam('id') id: string, @Body() updateDto: NotificationUpdateDto): Promise<Notification> {
		return this.notificationsService.update(+id, updateDto);
	}

	@Patch(':id/change-status')
	@Roles(0)
	@ApiOperation({ summary: 'Cambiar de estado' })
	changeStatus(@IdParam('id') id: string): Promise<Notification> {
		return this.notificationsService.changeStatus(+id);
	}
}
