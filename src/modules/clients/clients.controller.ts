import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientCreateDto, ClientQueryDto, ClientUpdateDto } from './dto/client.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Client } from './entities/client.entity';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { StatusDto } from 'src/core/common/dto/status.dto';

@ApiTags('Negocio - Clientes')
@Controller('clients')
export class ClientsController {
	constructor(private readonly clientsService: ClientsService) { }
	@Post()
	@ApiOperation({ summary: 'Creación de clientes' })
	create(@Body() createClientDto: ClientCreateDto): Promise<Client> {
		return this.clientsService.create(createClientDto);
	}

	@Get()
	@ApiOperation({ summary: 'Obtener listado de clientes - Paginación' })
	@ApiResult({ type: [Client], isPage: true })
	async findAll(@Query() dto: ClientQueryDto) {
		return this.clientsService.findAll(dto);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obtener cliente por su ID' })
	findOne(@Param('id') id: string): Promise<Client> {
		return this.clientsService.findOne(+id);
	}

	@Put(':id')
	@ApiOperation({ summary: 'Actualizar cliente' })
	update(@Param('id') id: string, @Body() updateClientDto: ClientUpdateDto): Promise<Client> {
		return this.clientsService.update(+id, updateClientDto);
	}

	@Patch(':id/change-status')
	@ApiOperation({ summary: 'Cambiar de estado cliente' })
	changeStatus(@Param('id') id: string, @Body() { status }: StatusDto): Promise<Client> {
		return this.clientsService.changeStatus(+id, status);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar cliente' })
	remove(@Param('id') id: string): Promise<void> {
		return this.clientsService.remove(+id);
	}
}
