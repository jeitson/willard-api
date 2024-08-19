import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { RoutesService } from './routes.service';
import { CreateRouteDto, UpdateRouteDto } from './dto/route.dto';
import { Route } from './entities/route.entity';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';

@ApiTags('Negocio - Rutas')
@Controller('routes')
export class RoutesController {
	constructor(private readonly routesServices: RoutesService) { }

	@Post()
	@ApiOperation({ summary: 'Crear una nueva ruta' })
	create(@Body() createRutaDto: CreateRouteDto): Promise<Route> {
		return this.routesServices.create(createRutaDto);
	}

	@Get()
	@ApiOperation({ summary: 'Obtener todas las rutas' })
	@ApiResult({ type: [Route], isPage: true })
	findAll(@Query() query): Promise<Route[]> {
		return this.routesServices.findAll(query);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obtener una ruta por su ID' })
	findOne(@IdParam('id') id: string): Promise<Route> {
		return this.routesServices.findOne(+id);
	}

	@Put(':id')
	@ApiOperation({ summary: 'Actualizar una ruta' })
	update(@IdParam('id') id: string, @Body() updateRutaDto: UpdateRouteDto): Promise<Route> {
		return this.routesServices.update(+id, updateRutaDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar una ruta' })
	remove(@IdParam('id') id: string): Promise<void> {
		return this.routesServices.remove(+id);
	}
}
