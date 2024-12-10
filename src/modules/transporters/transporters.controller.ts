import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { TransportersService } from './transporters.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { TransporterCreateDto, TransporterQueryDto, TransporterUpdateDto } from './dto/transporter.dto';
import { Transporter } from './entities/transporter.entity';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/common/decorators/role.decorator';
import { ROL } from 'src/core/constants/rol.constant';

@ApiTags('Negocio - Transportadores')
@UseGuards(RolesGuard)
@Controller('transporters')
export class TransportersController {
	constructor(private readonly transportersService: TransportersService) { }

	@Post()
	@Roles(ROL.ADMINISTRATOR)
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
	findOne(@IdParam('id') id: string): Promise<Transporter> {
		return this.transportersService.findOne(+id);
	}

	@Put(':id')
	@Roles(ROL.ADMINISTRATOR)
	@ApiOperation({ summary: 'Actualizar transportador' })
	update(@IdParam('id') id: string, @Body() updateTransporterDto: TransporterUpdateDto): Promise<Transporter> {
		return this.transportersService.update(+id, updateTransporterDto);
	}

	@Patch(':id/change-status')
	@Roles(ROL.ADMINISTRATOR)
	@ApiOperation({ summary: 'Cambiar de estado transportador' })
	changeStatus(@IdParam('id') id: string): Promise<Transporter> {
		return this.transportersService.changeStatus(+id);
	}

	@Delete(':id')
	@Roles(ROL.ADMINISTRATOR)
	@ApiOperation({ summary: 'Eliminar transportador' })
	remove(@IdParam('id') id: string): Promise<void> {
		return this.transportersService.remove(+id);
	}
}
