import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CollectionRequestService } from './collection_request.service';

import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiResult } from "src/core/common/decorators/api-result.decorator";
import { CollectionRequestCreateDto, CollectionRequestUpdateDto } from "./dto/collection_request.dto";
import { CollectionRequest } from './entities/collection_request.entity';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';

@ApiTags('Negocio - Solicitudes')
@Controller('collection-request')
export class CollectionRequestController {
	constructor(private readonly collectionsRequestervice: CollectionRequestService) { }

	@Post()
	@ApiOperation({ summary: 'Crear solicitud' })
	@ApiResult({ type: CollectionRequest })
	async create(@Body() createDto: CollectionRequestCreateDto): Promise<CollectionRequest> {
		return this.collectionsRequestervice.create(createDto);
	}

	@Get()
	@ApiOperation({ summary: 'Listar solicitudes' })
	@ApiResult({ type: [CollectionRequest] })
	async findAll(@Query() query: any): Promise<any> {
		return this.collectionsRequestervice.findAll(query);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obtener solicitud por ID' })
	@ApiResult({ type: CollectionRequest })
	async findOne(@IdParam('id') id: number): Promise<CollectionRequest> {
		return this.collectionsRequestervice.findOne(id);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Actualizar solicitud' })
	@ApiResult({ type: CollectionRequest })
	async update(@IdParam('id') id: number, @Body() updateDto: CollectionRequestUpdateDto): Promise<void> {
		await this.collectionsRequestervice.update(id, updateDto);
	}

	@Post(':id/reject')
	@ApiOperation({ summary: 'Rechazar solicitud' })
	@ApiResult({ type: CollectionRequest })
	async reject(@IdParam('id') id: number): Promise<void> {
		await this.collectionsRequestervice.reject(id);
	}

	@Post(':id/approve')
	@ApiOperation({ summary: 'Aprobar solicitud' })
	@ApiResult({ type: CollectionRequest })
	async approve(@IdParam('id') id: number): Promise<void> {
		await this.collectionsRequestervice.approve(id);
	}

	@Post(':id/cancel')
	@ApiOperation({ summary: 'Cancelar solicitud' })
	async cancel(@IdParam('id') id: number): Promise<void> {
		return this.collectionsRequestervice.cancel(id);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar solicitud' })
	async delete(@IdParam('id') id: number): Promise<void> {
		return this.collectionsRequestervice.delete(id);
	}
}
