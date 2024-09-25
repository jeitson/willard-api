import { Module } from '@nestjs/common';
import { CollectionRequestService } from './collection_request.service';
import { CollectionRequestController } from './collection_request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionRequest } from './entities/collection_request.entity';
import { PickUpLocationModule } from '../pick_up_location/pick_up_location.module';
import { CollectionRequestAuditsModule } from '../collection_request_audits/collection_request_audits.module';
import { TransportersModule } from '../transporters/transporters.module';
import { CollectionSitesModule } from '../collection_sites/collection_sites.module';

const providers = [CollectionRequestService]

@Module({
    imports: [TypeOrmModule.forFeature([CollectionRequest]), PickUpLocationModule, CollectionRequestAuditsModule, CollectionSitesModule],
    controllers: [CollectionRequestController],
    providers,
    exports: [TypeOrmModule, ...providers],
})
export class CollectionRequestModule {}
