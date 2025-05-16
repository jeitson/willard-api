import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { RoutesService } from './routes.service';
import { CreateRouteDto, UpdateRouteDto } from './dto/route.dto';
import { Route } from './entities/route.entity';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/common/decorators/role.decorator';
import { ROL } from 'src/core/constants/rol.constant';

@ApiTags('Negocio - Rutas')
@UseGuards(RolesGuard)
@Controller('collection-request/:id/routes')
export class RoutesController {
	constructor(private readonly routesServices: RoutesService) { }

	@Post()
	@Roles(ROL.PLANEADOR_TRANSPORTE, ROL.ADMINISTRATOR)
	@ApiOperation({ summary: 'Crear una nueva ruta' })
	create(@IdParam('id') id: string, @Body() createRutaDto: CreateRouteDto): Promise<Route> {
		return this.routesServices.create(+id, createRutaDto);
	}

	// @Put(':id')
	// @ApiOperation({ summary: 'Actualizar una ruta' })
	// update(@IdParam('id') id: string, @Body() updateRutaDto: UpdateRouteDto): Promise<Route> {
	// 	return this.routesServices.update(+id, updateRutaDto);
	// }

	// @Delete(':id')
	// @ApiOperation({ summary: 'Eliminar una ruta' })
	// remove(@IdParam('id') id: string): Promise<void> {
	// 	return this.routesServices.remove(+id);
	// }
}
