import { Module } from '@nestjs/common';
import { AuditGuiaService } from './audit-guia.service';
import { AuditGuiaController } from './audit-guia.controller';

@Module({
  controllers: [AuditGuiaController],
  providers: [AuditGuiaService],
})
export class AuditGuiaModule {}
