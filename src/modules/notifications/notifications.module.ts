import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationSend } from './entities/notification-send.entity';
import { UsersModule } from '../users/users.module';

const providers = [NotificationsService];

@Module({
	imports: [TypeOrmModule.forFeature([Notification, NotificationSend]), UsersModule],
	controllers: [NotificationsController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class NotificationsModule { }
