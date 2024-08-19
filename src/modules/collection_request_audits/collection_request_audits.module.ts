import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionRequestAudit } from './entities/collection_request_audit.entity';
import { CollectionRequestAuditsController } from './collection_request_audits.controller';
import { CollectionRequestAuditsService } from './collection_request_audits.service';

@Module({
	imports: [TypeOrmModule.forFeature([CollectionRequestAudit])],
	controllers: [CollectionRequestAuditsController],
	providers: [CollectionRequestAuditsService],
	exports: [CollectionRequestAuditsService],
})
export class CollectionRequestAuditsModule { }
