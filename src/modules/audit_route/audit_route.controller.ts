import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuditRouteService } from './audit_route.service';
import { Roles } from 'src/core/common/decorators/role.decorator';
import { Public } from 'src/core/common/decorators/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { ConciliateByTypesAuditRouteDto, ConciliateTotalsAuditRouteDto, ListAuditRouteDto } from './dto/audit_route.dto';
import { AuditRoute } from './entities/audit_route.entity';
import { ROL } from 'src/core/constants/rol.constant';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';

@ApiTags('Negocio - Auditoria Ruta')
@Controller('audit-route')
@UseGuards(RolesGuard)
export class AuditRouteController {
	constructor(private readonly auditRouteService: AuditRouteService) { }

	@Get('sync-pending')
	@Roles(ROL.AUDITORIA_PH)
	@ApiOperation({ summary: 'Listado de registros de transportadora - recepción' })
	@ApiResult({ type: [ListAuditRouteDto] })
	async findAllSyncPending() {
		return this.auditRouteService.findAllSyncPending();
	}

	@Get('')
	@Roles(ROL.AUDITORIA_PH)
	@ApiOperation({ summary: 'Listado de auditoria de rutas' })
	@ApiResult({ type: [AuditRoute] })
	async findAll() {
		return this.auditRouteService.findAll();
	}

	@Patch('conciliate-totals/:id')
	@Roles(ROL.AUDITORIA_PH)
	@ApiOperation({ summary: 'Conciliación total' })
	async conciliateTotals(@IdParam('id') id: string, @Body() body: ConciliateTotalsAuditRouteDto) {
		return this.auditRouteService.conciliateTotals(+id, body);
	}

	@Patch('conciliate-by-types/:id')
	@Roles(ROL.AUDITORIA_PH)
	@ApiOperation({ summary: 'Conciliación por tipos' })
	async conciliateByTypes(@IdParam('id') id: string, @Body() body: ConciliateByTypesAuditRouteDto) {
		return this.auditRouteService.conciliateByTypes(+id, body);
	}
}
