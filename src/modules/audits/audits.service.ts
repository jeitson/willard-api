import { Injectable } from '@nestjs/common';
import { AuditDto, AuditQueryDto } from './dto/audit.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { Audit } from './entities/audit.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { paginate } from 'src/core/helper/paginate';
import { User } from '../users/entities/user.entity';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';

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
			.leftJoinAndSelect('user.roles', 'userRoles');
	}

	async findAll({
		page,
		pageSize,
		title
	}: AuditQueryDto): Promise<Pagination<Partial<Audit>>> {
		const queryBuilder = this.createBaseQueryBuilder();

		if (title) {
			queryBuilder.andWhere('audit.title LIKE :title', { title: `%${title}%` });
		}

		const result = await paginate<Audit>(queryBuilder, {
			page,
			pageSize,
		});

		return {
			...result,
			items: result.items.map((audit: any) => {
				if (audit.response) {
					audit.response = JSON.parse(audit.response);
				}
				if (audit.payload) {
					audit.payload = JSON.parse(audit.payload);
				}

				const { user, ...content } = audit;

				return {
					...content,
					userName: audit.user ? audit.user.name : null,
					role: audit.user?.roles && audit.user.roles.length > 0 ? [audit.user.roles[0].name] : null,
				};
			})
		};
	}

	async findOneById(id: number): Promise<Partial<Audit> | undefined> {
		const audit: any = await this.createBaseQueryBuilder()
			.where('audit.id = :id', { id })
			.getOne();

		if (!audit) {
			throw new BusinessException('Petición no encontrada', 404);
		}

		if (audit.response) {
			audit.response = JSON.parse(audit.response);
		}
		if (audit.payload) {
			audit.payload = JSON.parse(audit.payload);
		}

		const { user, ...content } = audit;

		return {
			...content,
			userName: audit.user ? audit.user.name : null,
			role: audit.user?.roles && audit.user.roles.length > 0 ? [audit.user.roles[0].name] : null,
		};
	}

	async create(content: AuditDto): Promise<void> {
		await this.entityManager.transaction(async (manager) => {
			const r = manager.create(Audit, content);

			await manager.save(r);
		});
	}
}
