import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiService } from '../api.service';
import { ClientsModule } from 'src/modules/clients/clients.module';
import { HistoryJobsModule } from 'src/modules/history_jobs/history_jobs.module';
import { ShipmentsModule } from 'src/modules/shipments/shipments.module';
import { ReceptionsModule } from 'src/modules/receptions/receptions.module';

const providers = [TasksService, ApiService];

@Module({
	imports: [
		ClientsModule, ShipmentsModule, ReceptionsModule, HistoryJobsModule],
	providers,
	exports: providers,
})
export class TasksModule { }
