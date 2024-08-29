import { Injectable } from '@nestjs/common';
import { AuditDto, AuditQueryDto } from './dto/audit.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { Audit } from './entities/audit.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Like, Repository } from 'typeorm';
import { paginate } from 'src/core/helper/paginate';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/rol.entity';

@Injectable()
export class AuditsService {

	constructor(
		@InjectRepository(Audit)
		private readonly auditsRepository: Repository<Audit>,
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

		return paginate<Audit>(queryBuilder, {
			page,
			pageSize,
		});
	}

	async findOneById(id: number): Promise<Audit | undefined> {
		const queryBuilder = this.createBaseQueryBuilder()
			.where('audit.id = :id', { id });

		return queryBuilder.getOne();
	}

	async create(content: AuditDto): Promise<void> {
		await this.entityManager.transaction(async (manager) => {
			const r = manager.create(Audit, content);

			await manager.save(r);
		});
	}
}
