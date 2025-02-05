import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AuditGuideService } from './audit_guide.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/common/decorators/role.decorator';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { AuditGuide } from './entities/audit_guide.entity';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { AuditGuideConfirmUpdateDto, AuditGuideDetailUpdateDto, UpdateReasonDto } from './dto/audit_guide.dto';
import { ROL } from 'src/core/constants/rol.constant';

@ApiTags('Negocio - Auditoria de Guias')
@Controller('audit_guide')
@UseGuards(RolesGuard)
export class AuditGuideController {
	constructor(private readonly auditGuideService: AuditGuideService) { }

	@Get()
	// @Roles(ROL.AUDITORIA_PH)
	@ApiOperation({ summary: 'Listado de auditoria de guias' })
	@ApiResult({ type: [AuditGuide] })
	async findAll(@Query() query: any) {
		return this.auditGuideService.findAll(query);
	}

	@Get(':id')
	@Roles(ROL.AUDITORIA_PH)
	@ApiOperation({ summary: 'Obtener auditoria por ID' })
	@ApiResult({ type: AuditGuide })
	async findOne(@IdParam('id') id: string): Promise<AuditGuide> {
		return this.auditGuideService.findOne(id);
	}

	@Patch('details/:id')
	@Roles(ROL.AUDITORIA_PH)
	@ApiOperation({ summary: 'Actualizar detalle de auditoria por ID' })
	@ApiResult({ type: AuditGuide })
	async updateAuditGuideDetails(
		@IdParam('id') id: number,
		@Body() detailsToUpdate: AuditGuideDetailUpdateDto,
	): Promise<void> {
		await this.auditGuideService.updateDetails(id, detailsToUpdate);
	}

	@Post('give-reason/:id/:key')
	@Roles(ROL.AUDITORIA_PH)
	@ApiOperation({ summary: 'Dar la razón a una auditoria' })
	async updateInFavorRecuperator(
		@IdParam('id') id: number,
		@Param() params: UpdateReasonDto,
	): Promise<void> {
		const { key } = params;
		await this.auditGuideService.updateInFavorRecuperator({ id, key });
	}

	@Post('confirm/:id')
	@Roles(ROL.AUDITORIA_PH)
	@ApiOperation({ summary: 'Confirmar' })
	async confirm(
		@IdParam('id') id: number,
		@Body() content: AuditGuideConfirmUpdateDto
	): Promise<void> {
		await this.auditGuideService.confirm(id, content);
	}

	@Post('synchronize/:id')
	@Roles(ROL.AUDITORIA_PH)
	@ApiOperation({ summary: 'Sincronizar' })
	async synchronize(
		@IdParam('id') id: number,
	): Promise<void> {
		await this.auditGuideService.synchronize(id);
	}

}
