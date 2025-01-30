import { Module } from '@nestjs/common';
import { HistoryJobsService } from './history_jobs.service';
import { HistoryJobsController } from './history_jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryJob } from './entities/history_job.entity';

const providers = [HistoryJobsService];

@Module({
	imports: [TypeOrmModule.forFeature([HistoryJob])],
	controllers: [HistoryJobsController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class HistoryJobsModule { }
