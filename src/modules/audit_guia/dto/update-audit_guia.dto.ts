import { PartialType } from '@nestjs/swagger';
import { CreateAuditGuiaDto } from './create-audit_guia.dto';

export class UpdateAuditGuiaDto extends PartialType(CreateAuditGuiaDto) {}
