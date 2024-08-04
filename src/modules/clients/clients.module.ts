import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';

const providers = [ClientsService]

@Module({
	imports: [TypeOrmModule.forFeature([Client])],
	controllers: [ClientsController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class ClientsModule {}
