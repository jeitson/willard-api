import { Module } from '@nestjs/common';
import { RegistersService } from './registers.service';
import { RegistersController } from './registers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Register } from './entities/register.entity';
import { RegisterDetail } from './entities/register_detail.entity';
import { UsersModule } from '../users/users.module';

const providers = [RegistersService]

@Module({
	imports: [TypeOrmModule.forFeature([Register, RegisterDetail]), UsersModule],
	controllers: [RegistersController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class RegistersModule { }
