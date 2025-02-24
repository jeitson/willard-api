import { Module } from '@nestjs/common';
import { AuditRouteService } from './audit_route.service';
import { AuditRouteController } from './audit_route.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditRoute } from './entities/audit_route.entity';
import { AuditRouteDetail } from './entities/audit_route_detail.entity';

const providers = [AuditRouteService]

@Module({
	imports: [TypeOrmModule.forFeature([AuditRoute, AuditRouteDetail]),],
	controllers: [AuditRouteController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class AuditRouteModule {}
