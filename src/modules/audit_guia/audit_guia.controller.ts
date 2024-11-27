import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AuditGuiaService } from './audit_guia.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/common/decorators/role.decorator';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { AuditGuia } from './entities/audit_guia.entity';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { AuditGuiaDetailUpdateDto, UpdateReasonDto } from './dto/audit_guia.dto';

@ApiTags('Negocio - Auditoria de Guias')
@Controller('audit_guia')
@UseGuards(RolesGuard)
export class AuditGuiaController {
	constructor(private readonly auditGuiaService: AuditGuiaService) { }

	@Get()
	@Roles(19)
	@ApiOperation({ summary: 'Listado de auditoria de guias' })
	@ApiResult({ type: [AuditGuia] })
	async findAll(@Query() query: any): Promise<AuditGuia[]> {
		return this.auditGuiaService.findAll();
	}

	@Get(':id')
	@Roles(19)
	@ApiOperation({ summary: 'Obtener auditoria por ID' })
	@ApiResult({ type: AuditGuia })
	async findOne(@IdParam('id') id: string): Promise<AuditGuia> {
		return this.auditGuiaService.findOne(id);
	}

	@Patch('details/:id')
	@Roles(19)
	@ApiOperation({ summary: 'Actualizar detalle de auditoria por ID' })
	@ApiResult({ type: AuditGuia })
	async updateAuditGuiaDetails(
		@IdParam('id') id: number,
		@Body() detailsToUpdate: AuditGuiaDetailUpdateDto,
	): Promise<void> {
		await this.auditGuiaService.updateDetails(id, detailsToUpdate);
	}

	@Patch('give-reason/:id/:key')
	@Roles(19)
	@ApiOperation({ summary: 'Dar la razón a una auditoria' })
	async updateInFavorRecuperator(
		@IdParam('id') id: number,
		@Param() params: UpdateReasonDto,
	): Promise<void> {
		const { key } = params;
		await this.auditGuiaService.updateInFavorRecuperator({ id, key });
	}

	@Patch('confirm/:id')
	@Roles(19)
	@ApiOperation({ summary: 'Confirmar' })
	async confirm(
		@IdParam('id') id: number,
	): Promise<void> {
		await this.auditGuiaService.confirm(id);
	}

	@Post('synchronize/:id')
	@Roles(0)
	@ApiOperation({ summary: 'Sincronizar' })
	async synchronize(
		@IdParam('id') id: number,
	): Promise<void> {
		await this.auditGuiaService.synchronize(id);
	}

}
