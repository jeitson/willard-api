import { forwardRef, Module } from '@nestjs/common';
import { TransportersService } from './transporters.service';
import { TransportersController } from './transporters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transporter } from './entities/transporter.entity';
import { UsersModule } from '../users/users.module';

const providers = [TransportersService]

@Module({
	imports: [TypeOrmModule.forFeature([Transporter]), forwardRef(() => UsersModule)],
	controllers: [TransportersController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class TransportersModule { }
