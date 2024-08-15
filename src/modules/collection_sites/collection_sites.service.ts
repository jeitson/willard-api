import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CollectionSite } from './entities/collection_site.entity';
import { CollectionSiteCreateDto, CollectionSiteQueryDto, CollectionSiteUpdateDto } from './dto/collection_site.dto';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';

@Injectable()
export class CollectionSitesService {
	constructor(
		@InjectRepository(CollectionSite)
		private collectionSiteRepository: Repository<CollectionSite>,
	) { }

	async create(createCollectionSiteDto: CollectionSiteCreateDto): Promise<CollectionSite> {
		const collectionSite = this.collectionSiteRepository.create(createCollectionSiteDto);
		return await this.collectionSiteRepository.save(collectionSite);
	}

	async findAll({
		page,
		pageSize,
		name
	}: CollectionSiteQueryDto): Promise<Pagination<CollectionSite>> {
		const queryBuilder = this.collectionSiteRepository
			.createQueryBuilder('sedes_acopio')
			.where({
				...(name ? { name: Like(`%${name}%`) } : null),
			});

		return paginate<CollectionSite>(queryBuilder, {
			page,
			pageSize,
		});
	}

	async findOne(id: number): Promise<CollectionSite> {
		const collectionSite = await this.collectionSiteRepository.findOneBy({ id });
		if (!collectionSite) {
			throw new BusinessException(`Centro de acopio con ID ${id} no encontrado`, 404);
		}
		return collectionSite;
	}

	async update(id: number, updateCollectionSiteDto: CollectionSiteUpdateDto): Promise<CollectionSite> {
		await this.collectionSiteRepository.update(id, updateCollectionSiteDto);
		const updatedCollectionSite = await this.collectionSiteRepository.findOneBy({ id });
		if (!updatedCollectionSite) {
			throw new BusinessException(`Centro de acopio con ID ${id} no encontrado`, 404);

		}
		return updatedCollectionSite;
	}

	async changeStatus(id: number): Promise<CollectionSite> {
		const collectionSite = await this.collectionSiteRepository.findOneBy({ id });
		if (!collectionSite) {
			throw new BusinessException(`Centro de acopio con ID ${id} no encontrado`, 404);

		}
		collectionSite.status = !collectionSite.status;
		return await this.collectionSiteRepository.save(collectionSite);
	}

	async remove(id: number): Promise<void> {
		const result = await this.collectionSiteRepository.delete(id);
		if (result.affected === 0) {
			throw new BusinessException(`Centro de acopio con ID ${id} no encontrado`, 404);

		}
	}
}
