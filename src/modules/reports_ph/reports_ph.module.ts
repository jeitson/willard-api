import { Module } from '@nestjs/common';
import { ReportsPhService } from './reports_ph.service';
import { ReportsPhController } from './reports_ph.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsPh } from './entities/reports_ph.entity';

const providers = [ReportsPhService]

@Module({
	imports: [TypeOrmModule.forFeature([ReportsPh])],
	controllers: [ReportsPhController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class ReportsPhModule {}
