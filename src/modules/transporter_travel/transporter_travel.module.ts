import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { TransporterTravelService } from './transporter_travel.service';
import { TransporterTravel } from './entities/transporter_travel.entity';
import { TransporterTravelDetail } from './entities/transporter_travel_detail.entity';
import { TransporterTravelController } from './transporter_travel.controller';
import { ProductsModule } from '../products/products.module';
import { CatalogsModule } from '../catalogs/catalogs.module';
import { AuditGuideModule } from '../audit_guide/audit_guide.module';

const providers = [TransporterTravelService];

@Module({
	imports: [TypeOrmModule.forFeature([TransporterTravel, TransporterTravelDetail]), UsersModule, ProductsModule, CatalogsModule, forwardRef(() => AuditGuideModule)],
	controllers: [TransporterTravelController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class TransporterTravelModule { }
