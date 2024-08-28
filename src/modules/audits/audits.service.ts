import { Injectable } from '@nestjs/common';
import { AuditDto, AuditQueryDto } from './dto/audit.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { Audit } from './entities/audit.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Like, Repository } from 'typeorm';
import { paginate } from 'src/core/helper/paginate';
import { isEmpty } from 'class-validator';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuditsService {

	constructor(
		@InjectRepository(Audit)
		private readonly auditsRepository: Repository<Audit>,
		@InjectEntityManager() private entityManager: EntityManager,
		private dataSource: DataSource,
	) { }

	async findAll({
		page,
		pageSize,
		name
	}: AuditQueryDto): Promise<Pagination<Audit>> {
		const queryBuilder = this.dataSource
			.getRepository(Audit)
			.createQueryBuilder('audit')
			.leftJoinAndSelect(User, 'user', 'user.id = audit.userId');

		if (name) {
			queryBuilder.andWhere('audit.name LIKE :name', { name: `%${name}%` });
		}

		return paginate<Audit>(queryBuilder, {
			page,
			pageSize,
		});
	}


	async findOneById(id: number): Promise<Audit | undefined> {
		return this.auditsRepository
			.createQueryBuilder('auditoria')
			.leftJoinAndSelect('usuario', 'usuario', 'usuario.id = auditoria.userId')
			.where('auditoria.id = :id', { id })
			.getOne();
	}

	async create(content: AuditDto): Promise<void> {
		console.log(content);
		await this.entityManager.transaction(async (manager) => {
			const r = manager.create(Audit, content);

			await manager.save(r);
		});
	}
}
