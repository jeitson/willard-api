import { Module } from '@nestjs/common';
import { ConsultantsService } from './consultants.service';
import { ConsultantsController } from './consultants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultant } from './entities/consultant.entity';
import { UsersModule } from '../users/users.module';

const providers = [ConsultantsService]

@Module({
	imports: [TypeOrmModule.forFeature([Consultant]), UsersModule],
	controllers: [ConsultantsController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class ConsultantsModule {}
