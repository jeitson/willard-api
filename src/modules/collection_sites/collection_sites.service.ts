import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CollectionSite } from './entities/collection_site.entity';
import { CollectionSiteCreateDto, CollectionSiteQueryDto, CollectionSiteUpdateDto } from './dto/collection_site.dto';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { UserContextService } from '../users/user-context.service';

@Injectable()
export class CollectionSitesService {
	constructor(
		@InjectRepository(CollectionSite)
		private collectionSiteRepository: Repository<CollectionSite>,
		private readonly userContextService: UserContextService
	) { }

	async create(createCollectionSiteDto: CollectionSiteCreateDto): Promise<CollectionSite> {
		const user_id = this.userContextService.getUserDetails().id;

		const collectionSite = this.collectionSiteRepository.create({ ...createCollectionSiteDto, createdBy: user_id, modifiedBy: user_id });
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

	async update(id: number, updatedData: CollectionSiteUpdateDto): Promise<CollectionSite> {
		const updatedCollectionSite = await this.collectionSiteRepository.findOneBy({ id });

		if (!updatedCollectionSite) {
			throw new BusinessException(`Centro de acopio con ID ${id} no encontrado`, 404);
		}

		updatedData = Object.assign(updatedCollectionSite, updatedData);
		const modifiedBy = this.userContextService.getUserDetails().id;

		return await this.collectionSiteRepository.save({ ...updatedData, modifiedBy });
	}

	async changeStatus(id: number): Promise<CollectionSite> {
		const collectionSite = await this.findOne(id);
		collectionSite.status = !collectionSite.status;

		const modifiedBy = this.userContextService.getUserDetails().id;

		return await this.collectionSiteRepository.save({ ...collectionSite, modifiedBy });
	}

	async remove(id: number): Promise<void> {
		const consultant = await this.findOne(id);
		await this.collectionSiteRepository.remove(consultant);
	}
}
