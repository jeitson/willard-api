import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { TransportersService } from './transporters.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { TransporterCreateDto, TransporterQueryDto, TransporterUpdateDto } from './dto/transporter.dto';
import { Transporter } from './entities/transporter.entity';

@ApiTags('Negocio - Transportadores')
@Controller('transporters')
export class TransportersController {
	constructor(private readonly transportersService: TransportersService) { }

	@Post()
	@ApiOperation({ summary: 'Creación de transportador' })
	create(@Body() createTransporterDto: TransporterCreateDto): Promise<Transporter> {
		return this.transportersService.create(createTransporterDto);
	}

	@Get()
	@ApiOperation({ summary: 'Obtener listado de transportadores - Paginación' })
	@ApiResult({ type: [Transporter], isPage: true })
	async findAll(@Query() dto: TransporterQueryDto) {
		return this.transportersService.findAll(dto);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obtener transportador por su ID' })
	findOne(@Param('id') id: string): Promise<Transporter> {
		return this.transportersService.findOne(+id);
	}

	@Put(':id')
	@ApiOperation({ summary: 'Actualizar transportador' })
	update(@Param('id') id: string, @Body() updateTransporterDto: TransporterUpdateDto): Promise<Transporter> {
		return this.transportersService.update(+id, updateTransporterDto);
	}

	@Patch(':id/change-status')
	@ApiOperation({ summary: 'Cambiar de estado transportador' })
	changeStatus(@Param('id') id: string, @Body('status') status: boolean): Promise<Transporter> {
		return this.transportersService.changeStatus(+id, status);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar transportador' })
	remove(@Param('id') id: string): Promise<void> {
		return this.transportersService.remove(+id);
	}
}
