import { Module } from '@nestjs/common';
import { AuditGuiaService } from './audit_guia.service';
import { AuditGuiaController } from './audit_guia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditGuia } from './entities/audit_guia.entity';
import { AuditGuiaDetail } from './entities/audit_guia_detail.entity';

const providers = [AuditGuiaService]

@Module({
	imports: [TypeOrmModule.forFeature([AuditGuia, AuditGuiaDetail])],
	controllers: [AuditGuiaController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class AuditGuiaModule {}
