import { forwardRef, Module } from '@nestjs/common';
import { ReceptionsService } from './receptions.service';
import { ReceptionsController } from './receptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reception } from './entities/reception.entity';
import { ReceptionDetail } from './entities/reception_detail.entity';
import { ReceptionPhoto } from './entities/reception_photo.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { CollectionSitesModule } from '../collection_sites/collection_sites.module';
import { TransportersModule } from '../transporters/transporters.module';
import { AuditRouteModule } from '../audit_route/audit_route.module';

const providers = [ReceptionsService]

@Module({
	imports: [TypeOrmModule.forFeature([Reception, ReceptionDetail, ReceptionPhoto]), UsersModule, ProductsModule, CollectionSitesModule, TransportersModule, forwardRef(() => AuditRouteModule)],
	controllers: [ReceptionsController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class ReceptionsModule { }
