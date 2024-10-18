import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Put } from '@nestjs/common';
import { ReceptionsService } from './receptions.service';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/core/common/decorators/role.decorator';
import { ReceptionDto, ReceptionQueryDto, ReceptionUpdateDto } from './dto/create-reception.dto';
import { Reception } from './entities/reception.entity';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';

@ApiTags('Negocio - Recepción')
@UseGuards(RolesGuard)
@Controller('receptions')
export class ReceptionsController {
	constructor(private readonly receptionsService: ReceptionsService) { }

	@Post()
	@Roles(0)
	@ApiOperation({ summary: 'Creación' })
	create(@Body() createDto: ReceptionDto): Promise<Reception> {
		return this.receptionsService.create(createDto);
	}

	@Get()
	@Roles(18, 20)
	@ApiOperation({ summary: 'Obtener listado - Paginación' })
	@ApiResult({ type: [Reception], isPage: true })
	async findAll(@Query() dto: ReceptionQueryDto) {
		return this.receptionsService.findAll(dto);
	}

	@Get(':id')
	@Roles(18, 20)
	@ApiOperation({ summary: 'Obtener por ID' })
	findOne(@IdParam('id') id: string): Promise<Reception> {
		return this.receptionsService.findOne(+id);
	}

	@Put(':id')
	@Roles(18, 20)
	@ApiOperation({ summary: 'Actualizar' })
	async update(@IdParam('id') id: string, @Body() updateDto: ReceptionUpdateDto): Promise<Reception> {
		return this.receptionsService.update(+id, updateDto);
	}
}
