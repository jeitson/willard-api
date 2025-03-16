import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuditRouteService } from './audit_route.service';
import { Roles } from 'src/core/common/decorators/role.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { AuditRouteDto, ConfirmAuditRouteDto, GetInfoByRouteId, ListAuditRouteDto } from './dto/audit_route.dto';
import { AuditRoute } from './entities/audit_route.entity';
import { ROL } from 'src/core/constants/rol.constant';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Public } from 'src/core/common/decorators/public.decorator';

@ApiTags('Negocio - Auditoria Ruta')
@UseGuards(RolesGuard)
@Controller('audit-route')
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

	@Get('detail')
	@Roles(ROL.AUDITORIA_PH)
	@ApiOperation({ summary: 'Listado de auditoria de rutas' })
	@ApiResult({ type: AuditRouteDto })
	async findOneByRoute(@Query() content: GetInfoByRouteId) {
		return this.auditRouteService.findOneByRoute(content);
	}

	@Post('save')
	@Roles(ROL.AUDITORIA_PH)
	@ApiOperation({ summary: 'Confirmación de conciliación' })
	async confirm(@Body() body: ConfirmAuditRouteDto) {
		return this.auditRouteService.confirm(body);
	}
}
