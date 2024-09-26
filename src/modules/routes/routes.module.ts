import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { CollectionRequestModule } from '../collection_request/collection_request.module';
import { TransportersModule } from '../transporters/transporters.module';
import { CollectionRequestAuditsModule } from '../collection_request_audits/collection_request_audits.module';
import { UsersModule } from '../users/users.module';

const providers = [RoutesService]

@Module({
	imports: [TypeOrmModule.forFeature([Route]), CollectionRequestModule, CollectionRequestAuditsModule, TransportersModule, UsersModule],
	controllers: [RoutesController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class RoutesModule { }
