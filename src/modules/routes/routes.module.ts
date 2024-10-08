import { DriversModule } from './../drivers/drivers.module';
import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { UsersModule } from '../users/users.module';
import { MailerModule } from 'src/core/shared/mailer/mailer.module';
import { NotificationsModule } from '../notifications/notifications.module';

const providers = [RoutesService]

@Module({
	imports: [TypeOrmModule.forFeature([Route]), DriversModule, UsersModule, MailerModule, NotificationsModule],
	controllers: [RoutesController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class RoutesModule { }
