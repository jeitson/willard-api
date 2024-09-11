import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionRequestAudit } from './entities/collection_request_audit.entity';
import { CollectionRequestAuditsController } from './collection_request_audits.controller';
import { CollectionRequestAuditsService } from './collection_request_audits.service';

const providers = [CollectionRequestAuditsService]

@Module({
	imports: [TypeOrmModule.forFeature([CollectionRequestAudit])],
	controllers: [CollectionRequestAuditsController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class CollectionRequestAuditsModule { }
