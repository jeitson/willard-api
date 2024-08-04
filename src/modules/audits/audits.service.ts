import { Injectable } from '@nestjs/common';
import { AuditDto, AuditQueryDto } from './dto/audit.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { Audit } from './entities/audit.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { paginate } from 'src/core/helper/paginate';
import { isEmpty } from 'class-validator';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/core/constants/error-code.constant';

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
		Nombre
	}: AuditQueryDto): Promise<Pagination<Audit>> {
		const queryBuilder = this.auditsRepository
			.createQueryBuilder('rol')
			.where({
				...(Nombre ? { Nombre: Like(`%${Nombre}%`) } : null),
			});

		return paginate<Audit>(queryBuilder, {
			page,
			pageSize,
		});
	}

	async findOneById(id: number): Promise<Audit | undefined> {
		return this.auditsRepository.findOneBy({
			Id: id
		});
	}

	async create({
		Nombre,
		Descripcion,
		UsuarioId
	}: AuditDto): Promise<void> {
		const exists = await this.auditsRepository.findOneBy({ Nombre });

		if (!isEmpty(exists))
			throw new BusinessException('Ya existe el nombre');

		await this.entityManager.transaction(async (manager) => {
			const r = manager.create(Audit, {
				Nombre,
				Descripcion,
				UsuarioId
			});

			await manager.save(r);
		});
	}
}
