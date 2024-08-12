import { Injectable } from '@nestjs/common';
import { AuditDto, AuditQueryDto } from './dto/audit.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { Audit } from './entities/audit.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { paginate } from 'src/core/helper/paginate';
import { isEmpty } from 'class-validator';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';

@Injectable()
export class AuditsService {

	constructor(
		@InjectRepository(Audit)
		private readonly auditsRepository: Repository<Audit>,
		@InjectEntityManager() private entityManager: EntityManager
	) { }

	async findAll({
		page,
		pageSize,
		name
	}: AuditQueryDto): Promise<Pagination<Audit>> {
		const queryBuilder = this.auditsRepository
			.createQueryBuilder('rol')
			.where({
				...(name ? { name: Like(`%${name}%`) } : null),
			});

		return paginate<Audit>(queryBuilder, {
			page,
			pageSize,
		});
	}

	async findOneById(id: number): Promise<Audit | undefined> {
		return this.auditsRepository.findOneBy({
			id
		});
	}

	async create({
		name,
		description,
		userId
	}: AuditDto): Promise<void> {
		const exists = await this.auditsRepository.findOneBy({ name });

		if (!isEmpty(exists))
			throw new BusinessException('Ya existe el nombre');

		await this.entityManager.transaction(async (manager) => {
			const r = manager.create(Audit, {
				name,
				description,
				userId
			});

			await manager.save(r);
		});
	}
}
