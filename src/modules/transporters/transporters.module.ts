import { Module } from '@nestjs/common';
import { TransportersService } from './transporters.service';
import { TransportersController } from './transporters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transporter } from './entities/transporter.entity';

const providers = [TransportersService]

@Module({
	imports: [TypeOrmModule.forFeature([Transporter])],
	controllers: [TransportersController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class TransportersModule { }
