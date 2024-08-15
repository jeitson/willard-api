import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { ConsultantsService } from './consultants.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { Consultant } from './entities/consultant.entity';
import { ConsultantCreateDto, ConsultantQueryDto, ConsultantUpdateDto } from './dto/consultant.dto';

@ApiTags('Negocio - Asesores')
@Controller('consultants')
export class ConsultantsController {
	constructor(private readonly consultantsService: ConsultantsService) { }

	@Post()
	@ApiOperation({ summary: 'Creación de asesores' })
	create(@Body() createConsultantDto: ConsultantCreateDto): Promise<Consultant> {
		return this.consultantsService.create(createConsultantDto);
	}

	@Get()
	@ApiOperation({ summary: 'Obtener listado de asesores - Paginación' })
	@ApiResult({ type: [Consultant], isPage: true })
	async findAll(@Query() dto: ConsultantQueryDto) {
		return this.consultantsService.findAll(dto);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obtener asesor por su ID' })
	findOne(@Param('id') id: string): Promise<Consultant> {
		return this.consultantsService.findOne(+id);
	}

	@Put(':id')
	@ApiOperation({ summary: 'Actualizar asesor' })
	update(@Param('id') id: string, @Body() updateConsultantDto: ConsultantUpdateDto): Promise<Consultant> {
		return this.consultantsService.update(+id, updateConsultantDto);
	}

	@Patch(':id/change-status')
	@ApiOperation({ summary: 'Cambiar de estado asesor' })
	changeStatus(@Param('id') id: string, @Body('status') status: boolean): Promise<Consultant> {
		return this.consultantsService.changeStatus(+id, status);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar asesor' })
	remove(@Param('id') id: string): Promise<void> {
		return this.consultantsService.remove(+id);
	}
}
