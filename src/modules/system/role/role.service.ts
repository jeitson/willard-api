import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { EntityManager, Repository } from 'typeorm';

import { PagerDto } from 'src/core/common/dto/pager.dto';
import { ROOT_ROLE_ID } from 'src/core/constants/system.constant';
import { paginate } from 'src/core/helper/paginate';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { MenuEntity } from 'src/modules/system/menu/menu.entity';
import { RoleEntity } from 'src/modules/system/role/role.entity';

import { RoleDto, RoleUpdateDto } from './role.dto';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/core/constants/error-code.constant';

@Injectable()
export class RoleService {
	constructor(
		@InjectRepository(RoleEntity)
		private roleRepository: Repository<RoleEntity>,
		@InjectRepository(MenuEntity)
		private menuRepository: Repository<MenuEntity>,
		@InjectEntityManager() private entityManager: EntityManager,
	) {}

	/**
	 * Lista todos los roles excluyendo al superadministrador.
	 */
	async findAll({
		page,
		pageSize,
	}: PagerDto<RoleEntity>): Promise<Pagination<RoleEntity>> {
		return paginate(this.roleRepository, { page, pageSize });
	}

	/**
	 * Obtiene la información de un rol según su ID.
	 */
	async info(id: string) {
		const info = await this.roleRepository
			.createQueryBuilder('role')
			.where({
				id,
			})
			.getOne();

		const menus = await this.menuRepository.find({
			where: { roles: { id } },
			select: ['id'],
		});

		return { ...info, menuIds: menus.map((m) => m.id) };
	}

	async delete(id: string): Promise<void> {
		if (id === ROOT_ROLE_ID)
			throw new Error('No se puede eliminar al superadministrador');
		await this.roleRepository.delete(id);
	}

	/**
	 * Crea un nuevo rol.
	 */
	async create({ menuIds, ...data }: RoleDto): Promise<{ roleId: string }> {
		const isExist = this.roleRepository.findOneBy({ name: data.name });

		if (isExist) {
			throw new BusinessException(ErrorEnum.SYSTEM_ROLE_EXISTS);
			return;
		}

		const role = await this.roleRepository.save({
			...data,
			menus: menuIds ? await this.menuRepository.findByIds(menuIds) : [],
		});

		return { roleId: role.id };
	}

	/**
	 * Actualiza la información de un rol.
	 */
	async update(id, { menuIds, ...data }: RoleUpdateDto): Promise<void> {
		await this.roleRepository.update(id, data);

		if (!isEmpty(menuIds)) {
			// Usando una transacción
			await this.entityManager.transaction(async (manager) => {
				const menus = await this.menuRepository.findByIds(menuIds);

				const role = await this.roleRepository.findOne({
					where: { id },
				});
				role.menus = menus;
				await manager.save(role);
			});
		}
	}

	/**
	 * Obtiene los IDs de los roles asociados a un usuario.
	 */
	async getRoleIdsByUser(id: string): Promise<string[]> {
		const roles = await this.roleRepository.find({
			where: {
				users: { id },
			},
		});

		if (!isEmpty(roles)) return roles.map((r) => r.id);

		return [];
	}

	async getRoleValues(ids: string[]): Promise<string[]> {
		return (await this.roleRepository.findByIds(ids)).map((r) => r.value);
	}

	async isAdminRoleByUser(uid: string): Promise<boolean> {
		const roles = await this.roleRepository.find({
			where: {
				users: { id: uid },
			},
		});

		if (!isEmpty(roles)) {
			return roles.some((r) => r.id === ROOT_ROLE_ID);
		}
		return false;
	}

	hasAdminRole(rids: string[]): boolean {
		return rids.includes(ROOT_ROLE_ID);
	}

	/**
	 * Verifica si un rol tiene usuarios asociados.
	 */
	async checkUserByRoleId(id: string): Promise<boolean> {
		return this.roleRepository.exists({
			where: {
				users: {
					roles: { id },
				},
			},
		});
	}
}
