import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { ProductCreateDto, ProductQueryDto, ProductUpdateDto } from './dto/product.dto';
import { Product } from './entities/product.entity';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/common/decorators/role.decorator';
import { ROL } from 'src/core/constants/rol.constant';

@ApiTags('Negocio - Productos')
@UseGuards(RolesGuard)
@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) { }

	@Post()
	@Roles(ROL.ADMINISTRATOR)
	@ApiOperation({ summary: 'Creación de productos' })
	create(@Body() createProductDto: ProductCreateDto): Promise<Product> {
		return this.productsService.create(createProductDto);
	}

	@Get()
	@ApiOperation({ summary: 'Obtener listado de productos - Paginación' })
	@ApiResult({ type: [Product], isPage: true })
	async findAll(@Query() dto: ProductQueryDto) {
		return this.productsService.findAll(dto);
	}

	@Get('categories')
	@ApiOperation({ summary: 'Obtener listado de tipos de productos con productos' })
	async findAllByCategory() {
		return this.productsService.findAllByCategory();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obtener producto por su ID' })
	findOne(@IdParam('id') id: string): Promise<Product> {
		return this.productsService.findOne(+id);
	}

	@Put(':id')
	@Roles(ROL.ADMINISTRATOR)
	@ApiOperation({ summary: 'Actualizar producto' })
	async update(@IdParam('id') id: string, @Body() updateProductDto: ProductUpdateDto): Promise<Product> {
		return this.productsService.update(+id, updateProductDto);
	}

	@Patch(':id/change-status')
	@Roles(ROL.ADMINISTRATOR)
	@ApiOperation({ summary: 'Cambiar de estado producto' })
	changeStatus(@IdParam('id') id: string): Promise<Product> {
		return this.productsService.changeStatus(+id);
	}

	@Delete(':id')
	@Roles(ROL.ADMINISTRATOR)
	@ApiOperation({ summary: 'Eliminar producto' })
	remove(@IdParam('id') id: string): Promise<void> {
		return this.productsService.remove(+id);
	}
}
