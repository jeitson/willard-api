import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductCreateDto, ProductQueryDto, ProductUpdateDto } from './dto/product.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { UserContextService } from '../users/user-context.service';

@Injectable()
export class ProductsService {

	constructor(
		@InjectRepository(Product)
		private readonly productsRepository: Repository<Product>,
		private readonly userContextService: UserContextService
	) { }

	async create(productCreateDto: ProductCreateDto): Promise<Product> {
		const user_id = this.userContextService.getUserDetails().id;

		const product = this.productsRepository.create({ ...productCreateDto, createdBy: user_id, modifiedBy: user_id });
		return await this.productsRepository.save(product);
	}

	async update(id: number, updatedData: ProductUpdateDto): Promise<Product> {
		const product = await this.productsRepository.findOne({ where: { id } });

		if (!product) {
			throw new BusinessException('Producto no encontrado', 400);
		}

		updatedData = Object.assign(product, updatedData);
		const modifiedBy = this.userContextService.getUserDetails().id;

		return await this.productsRepository.save({ ...updatedData, modifiedBy });
	}

	async findAll({
		page,
		pageSize,
		name,
		productTypeId
	}: ProductQueryDto): Promise<Pagination<Product>> {
		const queryBuilder = this.productsRepository
			.createQueryBuilder('product')
			.where({
				...(name ? { name: Like(`%${name}%`) } : null),
			});

		if (productTypeId) {
			queryBuilder.andWhere('product.productTypeId = :productTypeId', { productTypeId });
		}

		return paginate<Product>(queryBuilder, {
			page,
			pageSize,
		});
	}

	async findOne(id: number): Promise<Product> {
		const product = await this.productsRepository.findOne({ where: { id } });
		if (!product) {
			throw new BusinessException('Producto no encontrado', 400);
		}
		return product;
	}

	async changeStatus(id: number): Promise<Product> {
		const product = await this.findOne(id);
		product.status = !product.status;

		const modifiedBy = this.userContextService.getUserDetails().id;

		return await this.productsRepository.save({ ...product, modifiedBy });
	}

	async remove(id: number): Promise<void> {
		const product = await this.findOne(id);
		await this.productsRepository.remove(product);
	}
}
