import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiService } from '../api.service';
import { ClientsModule } from 'src/modules/clients/clients.module';
import { Shipment } from 'src/modules/shipments/entities/shipment.entity';
import { Reception } from 'src/modules/receptions/entities/reception.entity';
import { HistoryJobsModule } from 'src/modules/history_jobs/history_jobs.module';
import { ScheduleModule } from '@nestjs/schedule';

const providers = [TasksService, ApiService];

@Module({
	imports: [
		ScheduleModule.forRoot(),
		ClientsModule, Shipment, Reception, HistoryJobsModule],
	providers,
	exports: providers,
})
export class TasksModule { }
