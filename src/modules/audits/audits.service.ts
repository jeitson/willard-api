import { Injectable } from '@nestjs/common';
import { AuditDto, AuditQueryDto } from './dto/audit.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { Audit } from './entities/audit.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { paginate } from 'src/core/helper/paginate';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuditsService {

	constructor(
		@InjectRepository(Audit)
		@InjectEntityManager() private entityManager: EntityManager,
		private dataSource: DataSource,
	) { }

	private createBaseQueryBuilder() {
		return this.dataSource
			.getRepository(Audit)
			.createQueryBuilder('audit')
			.leftJoinAndMapOne('audit.user', User, 'user', 'user.id = audit.userId')
			.leftJoinAndSelect('user.roles', 'userRoles')
			.leftJoinAndSelect('userRoles.role', 'role');
	}

	async findAll({
		page,
		pageSize,
		name
	}: AuditQueryDto): Promise<Pagination<Audit>> {
		const queryBuilder = this.createBaseQueryBuilder();

		if (name) {
			queryBuilder.andWhere('audit.name LIKE :name', { name: `%${name}%` });
		}

		const result = await paginate<Audit>(queryBuilder, {
			page,
			pageSize,
		});

		return {
			...result,
			items: result.items.map(audit => {
				if (audit.response) {
					audit.response = JSON.parse(audit.response);
				}
				if (audit.payload) {
					audit.payload = JSON.parse(audit.payload);
				}
				return audit;
			})
		};
	}

	async findOneById(id: number): Promise<Audit | undefined> {
		const audit = await this.createBaseQueryBuilder()
			.where('audit.id = :id', { id })
			.getOne();

		if (audit) {
			if (audit.response) {
				audit.response = JSON.parse(audit.response);
			}
			if (audit.payload) {
				audit.payload = JSON.parse(audit.payload);
			}
		}

		return audit;
	}

	async create(content: AuditDto): Promise<void> {
		await this.entityManager.transaction(async (manager) => {
			const r = manager.create(Audit, content);

			await manager.save(r);
		});
	}
}
