import { Module } from '@nestjs/common';
import { PickUpLocationsService } from './pick_up_location.service';
import { PickUpLocationsController } from './pick_up_location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickUpLocation } from './entities/pick_up_location.entity';
import { UsersModule } from '../users/users.module';

const providers = [PickUpLocationsService]

@Module({
	imports: [TypeOrmModule.forFeature([PickUpLocation]), UsersModule],
	controllers: [PickUpLocationsController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class PickUpLocationModule {}
