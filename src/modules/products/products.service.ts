import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductCreateDto, ProductQueryDto, ProductUpdateDto } from './dto/product.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';

@Injectable()
export class ProductsService {
	constructor(
		@InjectRepository(Product)
		private readonly productsRepository: Repository<Product>,
	) { }

	async create(productCreateDto: ProductCreateDto): Promise<Product> {
		const product = this.productsRepository.create(productCreateDto);
		return await this.productsRepository.save(product);
	}

	async update(id: number, productUpdateDto: ProductUpdateDto): Promise<Product> {
		const product = await this.productsRepository.findOne({ where: { Id: id } });
		if (!product) {
			throw new BusinessException('Producto no encontrado', 400);
		}
		Object.assign(product, productUpdateDto);
		return await this.productsRepository.save(product);
	}

	async findAll({
		page,
		pageSize,
		Nombre
	}: ProductQueryDto): Promise<Pagination<Product>> {
		const queryBuilder = this.productsRepository
			.createQueryBuilder('producto')
			.where({
				...(Nombre ? { Nombre: Like(`%${Nombre}%`) } : null),
			});

		return paginate<Product>(queryBuilder, {
			page,
			pageSize,
		});
	}

	async findOne(id: number): Promise<Product> {
		const product = await this.productsRepository.findOne({ where: { Id: id } });
		if (!product) {
			throw new BusinessException('Producto no encontrado', 400);
		}
		return product;
	}

	async changeStatus(id: number, status: boolean): Promise<Product> {
		const product = await this.findOne(id);
		product.Estado = status;
		return await this.productsRepository.save(product);
	}

	async remove(id: number): Promise<void> {
		const product = await this.findOne(id);
		await this.productsRepository.remove(product);
	}
}
