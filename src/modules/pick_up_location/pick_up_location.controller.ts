import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { PickUpLocationsService } from './pick_up_location.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { PickUpLocationCreateDto, PickUpLocationUpdateDto, PickUpLocationQueryDto } from './dto/pick_up_location.dto';
import { PickUpLocation } from './entities/pick_up_location.entity';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/common/decorators/role.decorator';

@ApiTags('Negocio - Lugares de Recogida')
@UseGuards(RolesGuard)
@Controller('pick-up-locations')
export class PickUpLocationsController {
	constructor(private readonly pickUpLocationsService: PickUpLocationsService) { }

	@Post()
	@Roles(0)
	@ApiOperation({ summary: 'Creación de lugar de recogida' })
	create(@Body() createPickUpLocationDto: PickUpLocationCreateDto): Promise<PickUpLocation> {
		return this.pickUpLocationsService.create(createPickUpLocationDto);
	}

	@Get()
	@Roles(0)
	@ApiOperation({ summary: 'Obtener listado de lugares de recogida - Paginación' })
	@ApiResult({ type: [PickUpLocation], isPage: true })
	async findAll(@Query() query: PickUpLocationQueryDto) {
		return this.pickUpLocationsService.findAll(query);
	}

	@Get(':id')
	@Roles(0)
	@ApiOperation({ summary: 'Obtener lugar de recogida por su ID' })
	findOne(@IdParam('id') id: string): Promise<PickUpLocation> {
		return this.pickUpLocationsService.findOne(+id);
	}

	@Put(':id')
	@Roles(0)
	@ApiOperation({ summary: 'Actualizar lugar de recogida' })
	update(@IdParam('id') id: string, @Body() updatePickUpLocationDto: PickUpLocationUpdateDto): Promise<PickUpLocation> {
		return this.pickUpLocationsService.update(+id, updatePickUpLocationDto);
	}

	@Patch(':id/change-status')
	@Roles(0)
	@ApiOperation({ summary: 'Cambiar estado del lugar de recogida' })
	changeStatus(@IdParam('id') id: string): Promise<PickUpLocation> {
		return this.pickUpLocationsService.changeStatus(+id);
	}

	@Delete(':id')
	@Roles(0)
	@ApiOperation({ summary: 'Eliminar lugar de recogida' })
	remove(@IdParam('id') id: string): Promise<void> {
		return this.pickUpLocationsService.remove(+id);
	}
}
