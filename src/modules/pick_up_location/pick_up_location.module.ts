import { Module } from '@nestjs/common';
import { PickUpLocationsService } from './pick_up_location.service';
import { PickUpLocationsController } from './pick_up_location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickUpLocation } from './entities/pick_up_location.entity';

const providers = [PickUpLocationsService]

@Module({
	imports: [TypeOrmModule.forFeature([PickUpLocation])],
	controllers: [PickUpLocationsController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class PickUpLocationModule {}
