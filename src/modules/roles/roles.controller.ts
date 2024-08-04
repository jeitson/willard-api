import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { RolDto, RolQueryDto, RolUpdateDto } from './dto/rol.dto';
import { Rol } from './entities/rol.entity';

@ApiTags('Sistema - Roles')
@Controller('roles')
export class RolesController {
	constructor(private readonly rolesService: RolesService) { }

	@Get()
	@ApiOperation({ summary: 'Obtener listado de todos los roles - Paginación' })
	@ApiResult({ type: [Rol], isPage: true })
	async findAll(@Query() dto: RolQueryDto) {
		return this.rolesService.findAll(dto);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obtener rol por su ID' })
	async findOneById(@IdParam() id: string) {
		return this.rolesService.findOneById(+id);
	}

	@Post()
	@ApiOperation({ summary: 'Crear rol' })
	async create(@Body() dto: RolDto): Promise<void> {
		await this.rolesService.create(dto);
	}

	@Put(':id')
	@ApiOperation({ summary: 'Actualizar rol' })
	async update(
		@IdParam() id: string,
		@Body() dto: RolUpdateDto,
	): Promise<void> {
		await this.rolesService.update(+id, dto);
	}
}
