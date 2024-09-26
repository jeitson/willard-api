import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { RolDto, RolQueryDto, RolUpdateDto } from './dto/rol.dto';
import { Role } from './entities/rol.entity';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/common/decorators/role.decorator';

@ApiTags('Sistema - Roles')
@Controller('roles')
@UseGuards(RolesGuard)
export class RolesController {
	constructor(private readonly rolesService: RolesService) { }

	@Get()
	@Roles(22)
	@ApiOperation({ summary: 'Obtener listado de todos los roles - Paginación' })
	@ApiResult({ type: [Role], isPage: true })
	async findAll(@Query() dto: RolQueryDto) {
		return this.rolesService.findAll(dto);
	}

	@Get(':id')
	@Roles(22)
	@ApiOperation({ summary: 'Obtener rol por su ID' })
	@ApiResult({ type: Role })
	async findOneById(@IdParam() id: string) {
		return this.rolesService.findOneById(+id);
	}

	@Post()
	@Roles(22)
	@ApiOperation({ summary: 'Crear rol' })
	async create(@Body() dto: RolDto): Promise<void> {
		await this.rolesService.create(dto);
	}

	@Put(':id')
	@Roles(22)
	@ApiOperation({ summary: 'Actualizar rol' })
	async update(
		@IdParam() id: string,
		@Body() dto: RolUpdateDto,
	): Promise<void> {
		await this.rolesService.update(+id, dto);
	}
}
