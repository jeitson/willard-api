import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsPh } from './entities/reports_ph.entity';
import { ReportsPhService } from './reports_ph.service';
import { ReportsPhController } from './reports_ph.controller';
import { ClientsModule } from '../clients/clients.module';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';

const providers = [ReportsPhService]

@Module({
	imports: [TypeOrmModule.forFeature([ReportsPh]), ClientsModule, ProductsModule, UsersModule],
	controllers: [ReportsPhController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class ReportsPhModule {}
