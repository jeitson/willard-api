import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/rol.entity';
import { EntityManager, Like, Repository } from 'typeorm';
import { RolDto, RolQueryDto, RolUpdateDto } from './dto/rol.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { isEmpty } from 'class-validator';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/core/constants/error-code.constant';

/**
 *
 * Roles
 *
    - PH ASESOR \ PH AGENCIA => 13
	- PLANEADOR DE TRANSPORTE => 14
	- WILLARD LOGISTICA => 15
	- FABRICA BW => 16
	- CONDUCTOR => 17
	- AGENCIA PH => 18
	- PH AUDITORIA => 19
	- RECUPERADOR => 20
	- AUDITORIA WILLARD => 21
*/


@Injectable()
export class RolesService {
	constructor(
		@InjectRepository(Role)
		private readonly rolesRepository: Repository<Role>,
		@InjectEntityManager() private entityManager: EntityManager
	) { }

	async findAll({
		page,
		pageSize,
		name
	}: RolQueryDto): Promise<Pagination<Role>> {
		const queryBuilder = this.rolesRepository
			.createQueryBuilder('rol')
			.where({
				...(name ? { name: Like(`%${name}%`) } : null),
			});

		return paginate<Role>(queryBuilder, {
			page,
			pageSize,
		});
	}

	async findOneById(id: number): Promise<Role | undefined> {
		return this.rolesRepository.findOneBy({
			id
		});
	}

	async create({
		name,
		description
	}: RolDto): Promise<void> {
		const exists = await this.rolesRepository.findOneBy({ name });

		if (!isEmpty(exists))
			throw new BusinessException(ErrorEnum.SYSTEM_ROLE_EXISTS);

		await this.entityManager.transaction(async (manager) => {
			const r = manager.create(Role, {
				name,
				description
			});

			await manager.save(r);
		});
	}

	async update(
		id: number,
		data: RolUpdateDto,
	): Promise<void> {
		await this.entityManager.transaction(async (manager) => {
			await manager.update(Role, id, data);
		});
	}
}
