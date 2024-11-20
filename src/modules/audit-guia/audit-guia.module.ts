import { Module } from '@nestjs/common';
import { AuditGuiaService } from './audit-guia.service';
import { AuditGuiaController } from './audit-guia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditGuia } from './entities/audit-guia.entity';
import { AuditGuiaDetail } from './entities/audit-guia_detail.entity';

const providers = [AuditGuiaService]

@Module({
	imports: [TypeOrmModule.forFeature([AuditGuia, AuditGuiaDetail])],
	controllers: [AuditGuiaController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class AuditGuiaModule {}
