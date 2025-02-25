import { Controller, Get, Query } from '@nestjs/common';
import { AuditRouteService } from './audit_route.service';
import { Roles } from 'src/core/common/decorators/role.decorator';
import { Public } from 'src/core/common/decorators/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';

@ApiTags('Negocio - Auditoria Ruta')
@Controller('audit-route')
export class AuditRouteController {
	constructor(private readonly auditRouteService: AuditRouteService) { }

	@Get()
	// @Roles(ROL.AUDITORIA_PH)
	@Public()
	@ApiOperation({ summary: 'Listado de registros de transportadora' })
	// @ApiResult({ type: [] })
	async findAll(@Query() query: any) {
		return this.auditRouteService.findAll();
	}
}
