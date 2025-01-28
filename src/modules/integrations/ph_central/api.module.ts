import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { TasksService } from './tasks/tasks.service';
import { TasksModule } from './tasks/tasks.module';

@Module({
  providers: [ApiService, TasksService],
  imports: [TasksModule]
})
export class ApiModule {}
