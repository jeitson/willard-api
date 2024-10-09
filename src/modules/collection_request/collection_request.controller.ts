import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { CollectionRequestService } from './collection_request.service';

import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiResult } from "src/core/common/decorators/api-result.decorator";
import { CollectionRequestCreateDto, CollectionRequestUpdateDto } from "./dto/collection_request.dto";
import { CollectionRequest } from './entities/collection_request.entity';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/common/decorators/role.decorator';

@ApiTags('Negocio - Solicitudes')
@Controller('collection-request')
@UseGuards(RolesGuard)
export class CollectionRequestController {
	constructor(private readonly collectionsRequestervice: CollectionRequestService) { }

	@Post()
	@Roles(13, 16)
	@ApiOperation({ summary: 'Crear solicitud' })
	@ApiResult({ type: CollectionRequest })
	async create(@Body() createDto: CollectionRequestCreateDto): Promise<CollectionRequest> {
		return this.collectionsRequestervice.create(createDto);
	}

	@Get()
	@Roles(13, 14, 15, 16)
	@ApiOperation({ summary: 'Listar solicitudes' })
	@ApiResult({ type: [CollectionRequest] })
	async findAll(@Query() query: any): Promise<any> {
		return this.collectionsRequestervice.findAll(query);
	}

	@Get(':id')
	@Roles(0)
	@ApiOperation({ summary: 'Obtener solicitud por ID' })
	@ApiResult({ type: CollectionRequest })
	async findOne(@IdParam('id') id: number): Promise<CollectionRequest> {
		return this.collectionsRequestervice.findOne(id);
	}

	@Patch(':id')
	@Roles(15)
	@ApiOperation({ summary: 'Completar información de la solicitud' })
	@ApiResult({ type: CollectionRequest })
	async completeInfo(@IdParam('id') id: number, @Body() updateDto: CollectionRequestUpdateDto): Promise<void> {
		await this.collectionsRequestervice.completeInfo(id, updateDto);
	}

	@Post(':id/reject')
	@Roles(14)
	@ApiOperation({ summary: 'Rechazar solicitud' })
	@ApiResult({ type: CollectionRequest })
	async reject(@IdParam('id') id: number): Promise<void> {
		await this.collectionsRequestervice.reject(id);
	}

	@Put(':id')
	@Roles(13, 16)
	@ApiOperation({ summary: 'Actualizar solicitud' })
	@ApiResult({ type: CollectionRequest })
	async update(@IdParam('id') id: number, @Body() updateDto: CollectionRequestCreateDto): Promise<void> {
		await this.collectionsRequestervice.update(id, updateDto);
	}

	@Post(':id/cancel')
	@Roles(13)
	@ApiOperation({ summary: 'Cancelar solicitud' })
	async cancel(@IdParam('id') id: number): Promise<void> {
		return this.collectionsRequestervice.cancel(id);
	}

	@Delete(':id')
	@Roles(13)
	@ApiOperation({ summary: 'Eliminar solicitud' })
	async delete(@IdParam('id') id: number): Promise<void> {
		return this.collectionsRequestervice.delete(id);
	}
}
