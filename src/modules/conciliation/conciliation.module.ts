import { Module } from '@nestjs/common';
import { ConciliationService } from './conciliation.service';
import { ConciliationController } from './conciliation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conciliation } from './entities/conciliation.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { CatalogsModule } from '../catalogs/catalogs.module';
import { TransporterTravelModule } from '../transporter_travel/transporter_travel.module';
import { ReceptionsModule } from '../receptions/receptions.module';

const providers = [ConciliationService];

@Module({
	imports: [TypeOrmModule.forFeature([Conciliation]), UsersModule, ProductsModule, CatalogsModule, TransporterTravelModule, ReceptionsModule],
	controllers: [ConciliationController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class ConciliationModule {}
