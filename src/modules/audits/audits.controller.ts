import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuditsService } from './audits.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { Audit } from './entities/audit.entity';
import { AuditQueryDto } from './dto/audit.dto';

@ApiTags('Sistema - Auditorias')
@Controller('audits')
export class AuditsController {
	constructor(private readonly auditsService: AuditsService) { }

	@Get()
	@ApiOperation({ summary: 'Obtener listado de auditorias - Paginación' })
	@ApiResult({ type: [Audit], isPage: true })
	async findAll(@Query() dto: AuditQueryDto) {
		return this.auditsService.findAll(dto);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obtener auditoria por su ID' })
	async findOneById(@IdParam() id: string) {
		return this.auditsService.findOneById(+id);
	}
}
