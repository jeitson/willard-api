import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { CollectionRequestModule } from '../collection_request/collection_request.module';
import { UsersModule } from '../users/users.module';
import { DriversController } from './drivers.controller';

const providers = [DriversService];

@Module({
    imports: [TypeOrmModule.forFeature([Driver]), CollectionRequestModule, UsersModule],
	controllers: [DriversController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class DriversModule { }
