import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { ShipmentsService } from './shipments.service';
import { ShipmentDto, ShipmentQueryDto, ShipmentUpdateDto } from './dto/create-shipment.dto';
import { Shipment } from './entities/shipment.entity';
import { Roles } from 'src/core/common/decorators/role.decorator';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { ROL } from 'src/core/constants/rol.constant';

@ApiTags('Negocio - Envíos')
@UseGuards(RolesGuard)
@Controller('shipments')
export class ShipmentsController {
	constructor(private readonly shipmentsService: ShipmentsService) { }

	@Post()
	@Roles(ROL.AGENCIA_PH)
	@ApiOperation({ summary: 'Creación' })
	create(@Body() createDto: ShipmentDto): Promise<Shipment> {
		return this.shipmentsService.create(createDto);
	}

	@Get()
	@Roles(ROL.AGENCIA_PH, ROL.RECUPERADORA)
	@ApiOperation({ summary: 'Obtener listado - Paginación' })
	@ApiResult({ type: [Shipment], isPage: true })
	async findAll(@Query() dto: ShipmentQueryDto) {
		return this.shipmentsService.findAll(dto);
	}

	@Get(':id')
	@Roles(ROL.AGENCIA_PH, ROL.RECUPERADORA)
	@ApiOperation({ summary: 'Obtener por ID' })
	findOne(@IdParam('id') id: string): Promise<Shipment> {
		return this.shipmentsService.findOne(+id);
	}

	// @Put(':id')
	// @Roles(ROL.AGENCIA_PH)
	// @ApiOperation({ summary: 'Actualizar' })
	// async update(@IdParam('id') id: string, @Body() updateDto: ShipmentUpdateDto): Promise<Shipment> {
	// 	return this.shipmentsService.update(+id, updateDto);
	// }
}
