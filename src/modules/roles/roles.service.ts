import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { EntityManager, Like, Repository } from 'typeorm';
import { RolDto, RolQueryDto, RolUpdateDto } from './dto/rol.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { isEmpty } from 'class-validator';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/core/constants/error-code.constant';

@Injectable()
export class RolesService {
	constructor(
		@InjectRepository(Rol)
		private readonly rolesRepository: Repository<Rol>,
		@InjectEntityManager() private entityManager: EntityManager
	) { }

	async findAll({
		page,
		pageSize,
		Nombre
	}: RolQueryDto): Promise<Pagination<Rol>> {
		const queryBuilder = this.rolesRepository
			.createQueryBuilder('rol')
			.where({
				...(Nombre ? { Nombre: Like(`%${Nombre}%`) } : null),
			});

		return paginate<Rol>(queryBuilder, {
			page,
			pageSize,
		});
	}

	async findOneById(id: string): Promise<Rol | undefined> {
		return this.rolesRepository.findOneBy({
			Id: id
		});
	}

	async create({
		Nombre,
		Descripcion
	}: RolDto): Promise<void> {
		const exists = await this.rolesRepository.findOneBy({ Nombre });

		if (!isEmpty(exists))
			throw new BusinessException(ErrorEnum.SYSTEM_ROLE_EXISTS);

		await this.entityManager.transaction(async (manager) => {
			const r = manager.create(Rol, {
				Nombre,
				Descripcion
			});

			await manager.save(r);
		});
	}

	async update(
		id: string,
		data: RolUpdateDto,
	): Promise<void> {
		await this.entityManager.transaction(async (manager) => {
			await manager.update(Rol, id, data);
		});
	}
}
