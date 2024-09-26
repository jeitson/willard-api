import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChildDto, ChildSearchDto, ChildUpdateDto } from './dto/child.dto';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { Child } from './entities/child.entity';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/common/decorators/role.decorator';

@ApiTags('Sistema - Catalogos')
@Controller('catalogs')
@UseGuards(RolesGuard)
export class CatalogsController {
	constructor(private readonly catalogsService: CatalogsService) { }

	@Post()
	@Roles(0)
	@ApiOperation({ summary: 'Crear hijos de catalogos' })
	async create(@Body() dto: ChildDto): Promise<void> {
		await this.catalogsService.createChild(dto);
	}

	@Put(':id')
	@Roles(0)
	@ApiOperation({ summary: 'Actualizar catalogo' })
	async update(@IdParam() id: string, @Body() updateChildDto: ChildUpdateDto): Promise<Child> {
		return await this.catalogsService.updateChild(+id, updateChildDto);
	}

	@Put(':id/change-order/:order')
	@Roles(0)
	@ApiOperation({ summary: 'Cambiar de orden' })
	async changeOrder(@IdParam() id: string, @IdParam('order') order: number): Promise<Child> {
		return await this.catalogsService.changeOrder(+id, order);
	}

	@Put(':id/change-parent/:parentId')
	@Roles(0)
	@ApiOperation({ summary: 'Cambiar de padre' })
	async changeParent(@IdParam() id: string, @IdParam('parentId') parentId: string): Promise<Child> {
		return await this.catalogsService.changeParent(+id, +parentId);
	}

	@Put(':id/change-status')
	@Roles(0)
	@ApiOperation({ summary: 'Cambiar de estados' })
	async changeStatus(@IdParam() id: string): Promise<Child> {
		return await this.catalogsService.changeStatus(+id);
	}

	// @Delete(':id')
	// @Roles(0)
	// @ApiOperation({ summary: 'Eliminar hijo' })
	// async delete(@IdParam() id: string): Promise<void> {
	// 	await this.catalogsService.deleteChild(+id);
	// }

	@Get(':id')
	@Roles(0)
	@ApiOperation({ summary: 'Obtener hijo por su ID' })
	async getById(@IdParam() id: string): Promise<Child> {
		return await this.catalogsService.getChildById(+id);
	}

	@Get('key/:key')
	@Roles(0)
	@ApiOperation({ summary: 'Obtener hijos por su llave - KEY' })
	async getByKey(@Param('key') key: string): Promise<Child[]> {
		return await this.catalogsService.getChildrenByKey(key);
	}

	@Get('key/:key/parent/:parentId')
	@Roles(0)
	@ApiOperation({ summary: 'Obtener hijos por su llave - KEY y su padre' })
	async getByKeyAndParentId(@Param('key') key: string, @IdParam('parentId') id: string): Promise<Child[]> {
		return await this.catalogsService.getChildrenByKeyAndParent(key, +id);
	}

	@Post('search-by-keys')
	@Roles(0)
	@ApiOperation({ summary: 'Buscar hijos de catalogos por sus padres' })
	async searchByKeys(@Body() { keys }: ChildSearchDto): Promise<Child[]> {
		return await this.catalogsService.getChildrenByKeys(keys);
	}

	// @Put(':id')
	// async update(
	// 	@IdParam() id: string,
	// 	@Body() dto: ChildUpdateDto,
	// ): Promise<void> {
	// 	await this.catalogsService.update(id, dto);
	// }
}
