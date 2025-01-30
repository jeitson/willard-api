import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiService } from '../api.service';
import { ClientsModule } from 'src/modules/clients/clients.module';
import { Shipment } from 'src/modules/shipments/entities/shipment.entity';
import { Reception } from 'src/modules/receptions/entities/reception.entity';

@Module({
	imports: [ClientsModule, Shipment, Reception],
	providers: [TasksService, ApiService],
	exports: [TasksService],
})
export class TasksModule { }
