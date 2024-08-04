import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { ProductCreateDto, ProductQueryDto, ProductUpdateDto } from './dto/product.dto';
import { Product } from './entities/product.entity';

@ApiTags('Negocio - Productos')
@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) { }

	@Post()
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

	@Get(':id')
	@ApiOperation({ summary: 'Obtener producto por su ID' })
	findOne(@Param('id') id: string): Promise<Product> {
		return this.productsService.findOne(+id);
	}

	@Put(':id')
	@ApiOperation({ summary: 'Actualizar producto' })
	update(@Param('id') id: string, @Body() updateProductDto: ProductUpdateDto): Promise<Product> {
		return this.productsService.update(+id, updateProductDto);
	}

	@Patch(':id/change-status')
	@ApiOperation({ summary: 'Cambiar de estado producto' })
	changeStatus(@Param('id') id: string, @Body('status') status: boolean): Promise<Product> {
		return this.productsService.changeStatus(+id, status);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar producto' })
	remove(@Param('id') id: string): Promise<void> {
		return this.productsService.remove(+id);
	}
}
