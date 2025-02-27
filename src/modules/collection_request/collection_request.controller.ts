import { Controller, Get, Post, Body, Patch, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { CollectionRequestService } from './collection_request.service';

import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiResult } from "src/core/common/decorators/api-result.decorator";
import { CollectionRequestCreateDto, CollectionRequestCompleteDto, CollectionRequestUpdateDto, CollectionRequestRouteInfoDto } from "./dto/collection_request.dto";
import { CollectionRequest } from './entities/collection_request.entity';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/common/decorators/role.decorator';
import { ROL } from 'src/core/constants/rol.constant';

@ApiTags('Negocio - Solicitudes')
@Controller('collection-request')
@UseGuards(RolesGuard)
export class CollectionRequestController {
	constructor(private readonly collectionsRequestervice: CollectionRequestService) { }

	@Post()
	@Roles(ROL.ASESOR_PH, ROL.FABRICA_BW, ROL.AGENCIA_PH)
	@ApiOperation({ summary: 'Crear solicitud' })
	@ApiResult({ type: CollectionRequest })
	async create(@Body() createDto: CollectionRequestCreateDto): Promise<CollectionRequest> {
		return this.collectionsRequestervice.create(createDto);
	}

	@Get()
	@Roles(ROL.ASESOR_PH, ROL.PLANEADOR_TRANSPORTE, ROL.WILLARD_LOGISTICA, ROL.FABRICA_BW, ROL.AGENCIA_PH)
	@ApiOperation({ summary: 'Listar solicitudes' })
	@ApiResult({ type: [CollectionRequest] })
	async findAll(@Query() query: any): Promise<any> {
		return this.collectionsRequestervice.findAll(query);
	}

	@Get(':id')
	@Roles(ROL.ASESOR_PH, ROL.PLANEADOR_TRANSPORTE, ROL.WILLARD_LOGISTICA, ROL.FABRICA_BW, ROL.AGENCIA_PH)
	@ApiOperation({ summary: 'Obtener solicitud por ID' })
	@ApiResult({ type: CollectionRequest })
	async findOne(@IdParam('id') id: number): Promise<CollectionRequest> {
		return this.collectionsRequestervice.findOne(id);
	}

	@Patch(':id')
	@Roles(ROL.WILLARD_LOGISTICA)
	@ApiOperation({ summary: 'Completar información de la solicitud' })
	@ApiResult({ type: CollectionRequest })
	async completeInfo(@IdParam('id') id: number, @Body() updateDto: CollectionRequestCompleteDto): Promise<void> {
		await this.collectionsRequestervice.completeInfo(id, updateDto);
	}

	@Post(':id/reject')
	@Roles(ROL.PLANEADOR_TRANSPORTE)
	@ApiOperation({ summary: 'Rechazar solicitud' })
	@ApiResult({ type: CollectionRequest })
	async reject(@IdParam('id') id: number): Promise<void> {
		await this.collectionsRequestervice.reject(id);
	}

	@Put(':id')
	@Roles(ROL.ASESOR_PH, ROL.FABRICA_BW, ROL.AGENCIA_PH)
	@ApiOperation({ summary: 'Actualizar solicitud' })
	@ApiResult({ type: CollectionRequest })
	async update(@IdParam('id') id: number, @Body() updateDto: CollectionRequestUpdateDto): Promise<void> {
		await this.collectionsRequestervice.update(id, updateDto);
	}

	@Post(':id/cancel')
	@Roles(ROL.ASESOR_PH, ROL.AGENCIA_PH)
	@ApiOperation({ summary: 'Cancelar solicitud' })
	async cancel(@IdParam('id') id: number): Promise<void> {
		return this.collectionsRequestervice.cancel(id);
	}

	@Delete(':id')
	@Roles(ROL.ASESOR_PH, ROL.AGENCIA_PH)
	@ApiOperation({ summary: 'Eliminar solicitud' })
	async delete(@IdParam('id') id: number): Promise<void> {
		return this.collectionsRequestervice.delete(id);
	}

	@Get('routes-pending')
	@Roles(ROL.PLANEADOR_TRANSPORTE)
	@ApiOperation({ summary: 'Listar solicitudes pendiente por cargar' })
	@ApiResult({ type: [CollectionRequest] })
	async findAllRoutePendingUpload(): Promise<CollectionRequest[]> {
		return this.collectionsRequestervice.findAllRoutePendingUpload();
	}

	@Post('routes-pending')
	@Roles(ROL.PLANEADOR_TRANSPORTE)
	@ApiOperation({ summary: 'Obtener información complementaria de las solicitudes pendiente por cargar' })
	@ApiResult({ type: [CollectionRequest] })
	async getRouteInfoPendingUpload(@Body() createDto: CollectionRequestRouteInfoDto): Promise<CollectionRequest[]> {
		return this.collectionsRequestervice.getRouteInfoPendingUpload(createDto);
	}
}
