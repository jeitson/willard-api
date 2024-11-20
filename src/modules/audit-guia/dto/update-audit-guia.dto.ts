import { PartialType } from '@nestjs/swagger';
import { CreateAuditGuiaDto } from './create-audit-guia.dto';

export class UpdateAuditGuiaDto extends PartialType(CreateAuditGuiaDto) {}
