import { Injectable } from '@nestjs/common';
import { HistoryJobDto, HistoryJobQueryDto } from './dto/history_job.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { HistoryJob } from './entities/history_job.entity';
import { EntityManager, Like, Repository } from 'typeorm';
import { paginate } from 'src/core/helper/paginate';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { UserContextService } from '../users/user-context.service';

@Injectable()
export class HistoryJobsService {
	constructor(
		@InjectRepository(HistoryJob)
		private readonly historyJobRepository: Repository<HistoryJob>,
		@InjectEntityManager() private entityManager: EntityManager,
	) { }

	async create({
		inputContent,
		outputContent,
		...content
	}: HistoryJobDto): Promise<void> {
		await this.entityManager.transaction(async (manager) => {
			const r = manager.create(HistoryJob, {
				inputContent: JSON.stringify(inputContent),
				outputContent: JSON.stringify(outputContent),
				...content,
			});

			await manager.save(r);
		});
	}

	async findAll({
		page,
		pageSize,
		name,
		key,
	}: HistoryJobQueryDto): Promise<Pagination<HistoryJob>> {
		const queryBuilder = this.historyJobRepository
			.createQueryBuilder('proceso_historial')
			.where({
				...(name ? { name: Like(`%${name}%`) } : null),
				...(key ? { key: Like(`%${key}%`) } : null),
			});

		const paginatedResult: any = await paginate<HistoryJob>(queryBuilder, {
			page,
			pageSize,
		});

		paginatedResult.items = paginatedResult.items.map((item) => {
			return {
				...item,
				inputContent: item.inputContent ? JSON.parse(item.inputContent) : [],
				outputContent: item.outputContent ? JSON.parse(item.outputContent) : [],
			};
		});

		return paginatedResult;
	}

	async findOneById(id: number): Promise<HistoryJob | undefined> {
		const item = await this.historyJobRepository.findOneBy({
			id
		});

		item.inputContent = item.inputContent ? JSON.parse(item.inputContent) : [];
		item.outputContent = item.outputContent ? JSON.parse(item.outputContent) : [];

		return item;
	}
}
