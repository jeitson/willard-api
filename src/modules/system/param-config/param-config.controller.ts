import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { ApiSecurityAuth } from 'src/core/common/decorators/swagger.decorator';
import { Pagination } from 'src/core/helper/paginate/pagination';
import {
	definePermission,
	Perm,
} from 'src/modules/auth/decorators/permission.decorator';
import { ParamConfigEntity } from 'src/modules/system/param-config/param-config.entity';

import { ParamConfigDto, ParamConfigQueryDto } from './param-config.dto';
import { ParamConfigService } from './param-config.service';

export const permissions = definePermission('system:param-config', {
	LIST: 'list',
	CREATE: 'create',
	READ: 'read',
	UPDATE: 'update',
	DELETE: 'delete',
} as const);

@ApiTags('Sistema - Módulo de Configuración de Parámetros')
@ApiSecurityAuth()
@Controller('param-config')
export class ParamConfigController {
	constructor(private paramConfigService: ParamConfigService) {}

	@Get()
	@ApiOperation({ summary: 'Obtener lista de configuraciones de parámetros' })
	@ApiResult({ type: [ParamConfigEntity], isPage: true })
	@Perm(permissions.LIST)
	async list(
		@Query() dto: ParamConfigQueryDto,
	): Promise<Pagination<ParamConfigEntity>> {
		return this.paramConfigService.page(dto);
	}

	@Post()
	@ApiOperation({ summary: 'Crear nueva configuración de parámetro' })
	@Perm(permissions.CREATE)
	async create(@Body() dto: ParamConfigDto): Promise<void> {
		await this.paramConfigService.isExistKey(dto.key);
		await this.paramConfigService.create(dto);
	}

	@Get(':id')
	@ApiOperation({
		summary: 'Consultar información de una configuración de parámetro',
	})
	@ApiResult({ type: ParamConfigEntity })
	@Perm(permissions.READ)
	async info(@IdParam() id: string): Promise<ParamConfigEntity> {
		return this.paramConfigService.findOne(id);
	}

	@Post(':id')
	@ApiOperation({
		summary: 'Actualizar configuración de parámetro existente',
	})
	@Perm(permissions.UPDATE)
	async update(
		@IdParam() id: string,
		@Body() dto: ParamConfigDto,
	): Promise<void> {
		await this.paramConfigService.update(id, dto);
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Eliminar una configuración de parámetro específica',
	})
	@Perm(permissions.DELETE)
	async delete(@IdParam() id: string): Promise<void> {
		await this.paramConfigService.delete(id);
	}
}
