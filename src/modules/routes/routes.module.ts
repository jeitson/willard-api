import { DriversModule } from './../drivers/drivers.module';
import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { CollectionRequestModule } from '../collection_request/collection_request.module';
import { CollectionRequestAuditsModule } from '../collection_request_audits/collection_request_audits.module';
import { UsersModule } from '../users/users.module';
import { MailerModule } from 'src/core/shared/mailer/mailer.module';

const providers = [RoutesService]

@Module({
	imports: [TypeOrmModule.forFeature([Route]), CollectionRequestModule, CollectionRequestAuditsModule, DriversModule, UsersModule, MailerModule],
	controllers: [RoutesController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class RoutesModule { }
