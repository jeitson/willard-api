import { forwardRef, Module } from '@nestjs/common';
import { AuditGuideService } from './audit_guide.service';
import { AuditGuideController } from './audit_guide.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditGuideRoute } from './entities/audit_guide-ruta.entity';
import { AuditGuideDetail } from './entities/audit_guide_detail.entity';
import { AuditGuide } from './entities/audit_guide.entity';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { TransporterTravelModule } from '../transporter_travel/transporter_travel.module';
import { CatalogsModule } from '../catalogs/catalogs.module';
import { ReportsPhModule } from '../reports_ph/reports_ph.module';
import { ReceptionsModule } from '../receptions/receptions.module';

const providers = [AuditGuideService]

@Module({
	imports: [TypeOrmModule.forFeature([AuditGuide, AuditGuideDetail, AuditGuideRoute]), ProductsModule, UsersModule, TransporterTravelModule, CatalogsModule, ReportsPhModule, forwardRef(() => ReceptionsModule)],
	controllers: [AuditGuideController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class AuditGuideModule {}
