import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { ConsultantsService } from './consultants.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { Consultant } from './entities/consultant.entity';
import { ConsultantCreateDto, ConsultantQueryDto, ConsultantUpdateDto } from './dto/consultant.dto';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/common/decorators/role.decorator';

@ApiTags('Negocio - Asesores')
@Controller('consultants')
@UseGuards(RolesGuard)
export class ConsultantsController {
	constructor(private readonly consultantsService: ConsultantsService) { }

	@Post()
	@Roles(0)
	@ApiOperation({ summary: 'Creación de asesores' })
	create(@Body() createConsultantDto: ConsultantCreateDto): Promise<Consultant> {
		return this.consultantsService.create(createConsultantDto);
	}

	@Get()
	@Roles(0)
	@ApiOperation({ summary: 'Obtener listado de asesores - Paginación' })
	@ApiResult({ type: [Consultant], isPage: true })
	async findAll(@Query() dto: ConsultantQueryDto) {
		return this.consultantsService.findAll(dto);
	}

	@Get(':id')
	@Roles(0)
	@ApiOperation({ summary: 'Obtener asesor por su ID' })
	findOne(@IdParam('id') id: string): Promise<Consultant> {
		return this.consultantsService.findOne(+id);
	}

	@Put(':id')
	@Roles(0)
	@ApiOperation({ summary: 'Actualizar asesor' })
	update(@IdParam('id') id: string, @Body() updateConsultantDto: ConsultantUpdateDto): Promise<Consultant> {
		return this.consultantsService.update(+id, updateConsultantDto);
	}

	@Patch(':id/change-status')
	@Roles(0)
	@ApiOperation({ summary: 'Cambiar de estado asesor' })
	changeStatus(@Param('id') id: string): Promise<Consultant> {
		return this.consultantsService.changeStatus(+id);
	}

	@Delete(':id')
	@Roles(0)
	@ApiOperation({ summary: 'Eliminar asesor' })
	remove(@IdParam('id') id: string): Promise<void> {
		return this.consultantsService.remove(+id);
	}
}
