import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { TasksModule } from './tasks/tasks.module';

@Module({
	providers: [ApiService],
	imports: [TasksModule],
	exports: [ApiService]
})
export class ApiModule { }
