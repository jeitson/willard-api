import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductCreateDto, ProductQueryDto, ProductUpdateDto } from './dto/product.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { UserContextService } from '../users/user-context.service';
import { Child } from '../catalogs/entities/child.entity';
import { CatalogsService } from '../catalogs/catalogs.service';

@Injectable()
export class ProductsService {

	constructor(
		@InjectRepository(Product)
		private readonly productsRepository: Repository<Product>,
		private readonly childService: CatalogsService,
		private readonly userContextService: UserContextService
	) { }

	async create(productCreateDto: ProductCreateDto): Promise<Product> {
		const isExist = await this.productsRepository.findOne({ where: { name: productCreateDto.name } });

		if (isExist) {
			throw new BusinessException('El producto ya existe', 400);
		}

		const user_id = this.userContextService.getUserDetails().id;

		const product = this.productsRepository.create({ ...productCreateDto, name: productCreateDto.name.toUpperCase(), createdBy: user_id, modifiedBy: user_id });
		return await this.productsRepository.save(product);
	}

	async update(id: number, updatedData: ProductUpdateDto): Promise<Product> {
		const product = await this.productsRepository.findOne({ where: { id } });

		if (!product) {
			throw new BusinessException('Producto no encontrado', 400);
		}

		updatedData = Object.assign(product, updatedData);
		const modifiedBy = this.userContextService.getUserDetails().id;

		return await this.productsRepository.save({ ...updatedData, name: updatedData.name.toUpperCase(), modifiedBy });
	}

	async findAll({
		page,
		pageSize,
		name,
		productTypeId
	}: ProductQueryDto): Promise<Pagination<Product>> {
		const queryBuilder = this.productsRepository
			.createQueryBuilder('product')
			.leftJoinAndMapOne('product.productType', Child, 'child', 'child.id = product.productTypeId')
			.where({
				...(name ? { name: Like(`%${name}%`) } : null),
			});

		if (productTypeId) {
			queryBuilder.andWhere('product.productTypeId = :productTypeId', { productTypeId });
		}

		queryBuilder.select([
			'product',
			'child.name'
		]);

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

	async findAllByCategory(): Promise<any[]> {
		const categories = await this.childService.getChildrenByKey('TIPO_PRODUCTO');

		const categoryIds = categories.map(({ id }) => id);

		const products = await this.productsRepository.find({
			where: { productTypeId: In(categoryIds), status: true },
		});

		const productsByCategoryId = products.reduce((acc, product) => {
			if (!acc[product.productTypeId]) {
				acc[product.productTypeId] = [];
			}
			acc[product.productTypeId].push(product);
			return acc;
		}, {} as Record<number, Product[]>);

		const categoriesWithProducts = categories.map((category) => ({
			...category,
			products: productsByCategoryId[category.id] || [],
		}));

		return categoriesWithProducts;
	}
}
