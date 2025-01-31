import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { UsersModule } from '../users/users.module';
import { ClientsCronService } from './clients.cron.service';

const providers = [ClientsService, ClientsCronService]

@Module({
	imports: [TypeOrmModule.forFeature([Client]), UsersModule],
	controllers: [ClientsController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class ClientsModule {}
