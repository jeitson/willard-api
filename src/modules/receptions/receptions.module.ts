import { Module } from '@nestjs/common';
import { ReceptionsService } from './receptions.service';
import { ReceptionsController } from './receptions.controller';

@Module({
  controllers: [ReceptionsController],
  providers: [ReceptionsService],
})
export class ReceptionsModule {}
