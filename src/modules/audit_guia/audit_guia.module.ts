import { Module } from '@nestjs/common';
import { AuditGuiaService } from './audit_guia.service';
import { AuditGuiaController } from './audit_guia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditGuiaRoute } from './entities/audit_guia-ruta.entity';
import { AuditGuiaDetail } from './entities/audit_guia_detail.entity';
import { AuditGuia } from './entities/audit_guia.entity';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { TransporterTravelModule } from '../transporter_travel/transporter_travel.module';
import { CatalogsModule } from '../catalogs/catalogs.module';
import { ReportsPhModule } from '../reports_ph/reports_ph.module';

const providers = [AuditGuiaService]

@Module({
	imports: [TypeOrmModule.forFeature([AuditGuia, AuditGuiaDetail, AuditGuiaRoute]), ProductsModule, UsersModule, TransporterTravelModule, CatalogsModule, ReportsPhModule],
	controllers: [AuditGuiaController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class AuditGuiaModule {}
