import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Erc } from 'src/core/entities/erc.entity';
import { HistoryJobsModule } from '../history_jobs/history_jobs.module';
import { UsersModule } from '../users/users.module';

@Module({
	imports: [TypeOrmModule.forFeature([Erc]), HistoryJobsModule, UsersModule],
	controllers: [ReportsController],
	providers: [ReportsService],
})
export class ReportsModule { }
