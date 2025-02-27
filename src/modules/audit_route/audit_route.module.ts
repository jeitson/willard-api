import { Module } from '@nestjs/common';
import { AuditRouteService } from './audit_route.service';
import { AuditRouteController } from './audit_route.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditRoute } from './entities/audit_route.entity';
import { AuditRouteDetail } from './entities/audit_route_detail.entity';
import { TransporterTravelModule } from '../transporter_travel/transporter_travel.module';
import { ReceptionsModule } from '../receptions/receptions.module';
import { CatalogsModule } from '../catalogs/catalogs.module';
import { UsersModule } from '../users/users.module';

const providers = [AuditRouteService]

@Module({
	imports: [TypeOrmModule.forFeature([AuditRoute, AuditRouteDetail]), TransporterTravelModule, ReceptionsModule, CatalogsModule, UsersModule],
	controllers: [AuditRouteController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class AuditRouteModule {}
