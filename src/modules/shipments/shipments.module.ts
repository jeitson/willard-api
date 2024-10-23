import { Module } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { ShipmentsController } from './shipments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from './entities/shipment.entity';
import { ShipmentDetail } from './entities/shipment_detail.entity';
import { ShipmentPhoto } from './entities/shipment_photo.entity';
import { ShipmentERC } from './entities/shipment_erc.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { CollectionSitesModule } from '../collection_sites/collection_sites.module';
import { TransportersModule } from '../transporters/transporters.module';

const providers = [ShipmentsService]

@Module({
	imports: [TypeOrmModule.forFeature([Shipment, ShipmentDetail, ShipmentPhoto, ShipmentERC]), UsersModule, ProductsModule, CollectionSitesModule, TransportersModule],
	controllers: [ShipmentsController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class ShipmentsModule { }
