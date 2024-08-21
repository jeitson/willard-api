import { Module } from '@nestjs/common';
import { CollectionRequestService } from './collection_request.service';
import { CollectionRequestController } from './collection_request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionRequest } from './entities/collection_request.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CollectionRequest])],
    providers: [CollectionRequestService],
    controllers: [CollectionRequestController],
    exports: [CollectionRequestService],
})
export class CollectionRequestModule {}
