import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientCreateDto, ClientQueryDto, ClientUpdateDto } from './dto/client.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Client } from './entities/client.entity';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/common/decorators/role.decorator';

@ApiTags('Negocio - Clientes')
@Controller('clients')
@UseGuards(RolesGuard)
export class ClientsController {
	constructor(private readonly clientsService: ClientsService) { }

	@Post()
	@Roles(0)
	@ApiOperation({ summary: 'Creación de clientes' })
	create(@Body() createClientDto: ClientCreateDto): Promise<Client> {
		return this.clientsService.create(createClientDto);
	}

	@Get()
	@Roles(0)
	@ApiOperation({ summary: 'Obtener listado de clientes - Paginación' })
	@ApiResult({ type: [Client], isPage: true })
	async findAll(@Query() dto: ClientQueryDto) {
		return this.clientsService.findAll(dto);
	}

	@Get(':id')
	@Roles(0)
	@ApiOperation({ summary: 'Obtener cliente por su ID' })
	findOne(@IdParam('id') id: string): Promise<Client> {
		return this.clientsService.findOne(+id);
	}

	@Put(':id')
	@Roles(0)
	@ApiOperation({ summary: 'Actualizar cliente' })
	update(@IdParam('id') id: string, @Body() updateClientDto: ClientUpdateDto): Promise<Client> {
		return this.clientsService.update(+id, updateClientDto);
	}

	@Patch(':id/change-status')
	@Roles(0)
	@ApiOperation({ summary: 'Cambiar de estado cliente' })

	changeStatus(@IdParam('id') id: string): Promise<Client> {
		return this.clientsService.changeStatus(+id);
	}

	@Delete(':id')
	@Roles(0)
	remove(@IdParam('id') id: string): Promise<void> {
		return this.clientsService.remove(+id);
	}
}
