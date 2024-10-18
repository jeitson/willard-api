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
import { UserContextService } from '../users/user-context.service';

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
	- ADMINSTRATOR => 22
*/


@Injectable()
export class RolesService {
	constructor(
		@InjectRepository(Role)
		private readonly rolesRepository: Repository<Role>,
		@InjectEntityManager() private entityManager: EntityManager,
		private readonly userContextService: UserContextService
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

		const paginatedResult: any = await paginate<Role>(queryBuilder, {
			page,
			pageSize,
		});

		paginatedResult.items = paginatedResult.items.map((role) => {
			return {
				...role,
				menu: role.menu ? JSON.parse(role.menu) : [],
			};
		});

		return paginatedResult;
	}


	async findOneById(id: number): Promise<Role | undefined> {
		const role = await this.rolesRepository.findOneBy({
			id
		});

		role.menu = role.menu ? JSON.parse(role.menu) : [];

		return role;
	}

	async create({
		name,
		description,
		menu
	}: RolDto): Promise<void> {
		const exists = await this.rolesRepository.findOneBy({ name });

		if (!isEmpty(exists))
			throw new BusinessException(ErrorEnum.SYSTEM_ROLE_EXISTS);

		await this.entityManager.transaction(async (manager) => {
			const user_id = this.userContextService.getUserDetails().id;

			const r = manager.create(Role, {
				name,
				description,
				menu: JSON.stringify(menu),
				createdBy: user_id,
				modifiedBy: user_id,
			});

			await manager.save(r);
		});
	}

	async update(
		id: number,
		updatedData: RolUpdateDto,
	): Promise<void> {
		const rol = await this.rolesRepository.findOneBy({ id });

		if (!rol) {
			throw new BusinessException('No existe el rol', 400);
		}

		updatedData = Object.assign(rol, updatedData);

		const modifiedBy = this.userContextService.getUserDetails().id;

		await this.rolesRepository.save({ ...updatedData, menu: JSON.stringify(updatedData.menu), modifiedBy });
	}
}
