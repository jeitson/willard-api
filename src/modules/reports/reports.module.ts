import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Erc } from 'src/core/entities/erc.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Erc])],
	controllers: [ReportsController],
	providers: [ReportsService],
})
export class ReportsModule { }
