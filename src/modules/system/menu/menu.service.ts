/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { concat, isEmpty, uniq } from 'lodash';

import { In, IsNull, Like, Not, Repository } from 'typeorm';

import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/core/constants/error-code.constant';
import { MenuEntity } from 'src/modules/system/menu/menu.entity';

import { deleteEmptyChildren } from 'src/core/utils';

import { RoleService } from '../role/role.service';

import { MenuDto, MenuQueryDto, MenuUpdateDto } from './menu.dto';

@Injectable()
export class MenuService {
	constructor(
		@InjectRepository(MenuEntity)
		private menuRepository: Repository<MenuEntity>,
		private roleService: RoleService,
	) {}

	/**
	 * Obtiene todos los menús y permisos
	 */
	async list({
		name,
		path,
		permission,
		component,
		status,
	}: MenuQueryDto): Promise<MenuEntity[]> {
		const menus = await this.menuRepository.find({
			where: {
				...(name && { name: Like(`%${name}%`) }),
				...(path && { path: Like(`%${path}%`) }),
				...(permission && { permission: Like(`%${permission}%`) }),
				...(component && { component: Like(`%${component}%`) }),
				...(status && { status }),
			},
			order: { orderNo: 'ASC' },
		});

		if (!isEmpty(menus)) {
			deleteEmptyChildren(menus);
			return menus;
		}

		// Si el árbol generado está vacío, devuelve la lista de menús original
		return menus;
	}

	async create(menu: MenuDto): Promise<void> {
		// const result = await this.menuRepository.save(menu);
		// this.sseService.noticeClientToUpdateMenusByMenuIds([result]);
	}

	async update(id: string, menu: MenuUpdateDto): Promise<void> {
		// await this.menuRepository.update(id, menu);
		// this.sseService.noticeClientToUpdateMenusByMenuIds([id]);
	}

	/**
	 * Obtiene los menús según el rol del usuario
	 */
	async getMenus(uid: string) {
		const roleIds = await this.roleService.getRoleIdsByUser(uid);
		let menus: MenuEntity[] = [];

		if (isEmpty(roleIds)) return [];

		if (this.roleService.hasAdminRole(roleIds)) {
			menus = await this.menuRepository.find({
				order: { orderNo: 'ASC' },
			});
		} else {
			menus = await this.menuRepository
				.createQueryBuilder('menu')
				.innerJoinAndSelect('menu.roles', 'role')
				.andWhere('role.id IN (:...roleIds)', { roleIds })
				.orderBy('menu.order_no', 'ASC')
				.getMany();
		}

		return menus;
	}

	/**
	 * Comprueba si las reglas de creación del menú son válidas
	 */
	async check(dto: Partial<MenuDto>): Promise<void | never> {
		if (dto.type === 2 && !dto.parentId) {
			// No se puede crear un permiso directamente, debe tener un padre
			throw new BusinessException(ErrorEnum.PERMISSION_REQUIRES_PARENT);
		}
		if (dto.type === 1 && dto.parentId) {
			const parent = await this.getMenuItemInfo(dto.parentId);
			if (isEmpty(parent))
				throw new BusinessException(ErrorEnum.PARENT_MENU_NOT_FOUND);

			if (parent && parent.type === 1) {
				// Intento ilegal: el nuevo menú es un menú pero su padre también es un menú
				throw new BusinessException(
					ErrorEnum.ILLEGAL_OPERATION_DIRECTORY_PARENT,
				);
			}
		}
	}

	/**
	 * Busca los menús hijos de un menú específico (por ID)
	 */
	async findChildMenus(mid: string): Promise<any> {
		const allMenus: any = [];
		const menus = await this.menuRepository.findBy({ parentId: mid });

		for (const menu of menus) {
			if (menu.type !== 2) {
				// Si el hijo no es un permiso, continúa buscando en sus hijos
				const c = await this.findChildMenus(menu.id);
				allMenus.push(c);
			}
			allMenus.push(menu.id);
		}

		return allMenus;
	}

	/**
	 * Obtiene la información de un menú específico (por ID)
	 * @param mid ID del menú
	 */
	async getMenuItemInfo(mid: string): Promise<MenuEntity> {
		const menu = await this.menuRepository.findOneBy({ id: mid });
		return menu;
	}

	/**
	 * Obtiene la información de un menú específico y su padre
	 */
	async getMenuItemAndParentInfo(mid: string) {
		const menu = await this.menuRepository.findOneBy({ id: mid });
		let parentMenu: MenuEntity | undefined;
		if (menu && menu.parentId)
			parentMenu = await this.menuRepository.findOneBy({
				id: menu.parentId,
			});

		return { menu, parentMenu };
	}

	/**
	 * Comprueba si existe una ruta de nodo específica
	 */
	async findRouterExist(path: string): Promise<boolean> {
		const menu = await this.menuRepository.findOneBy({ path });
		return !isEmpty(menu);
	}

	/**
	 * Obtiene todos los permisos del usuario actual
	 */
	async getPermissions(uid: string): Promise<string[]> {
		const roleIds = await this.roleService.getRoleIdsByUser(uid);
		let permissions: string[] = [];

		if (this.roleService.hasAdminRole(roleIds)) {
			const result = await this.menuRepository.findBy({
				permission: Not(IsNull()),
				type: In([1, 2]),
			});

			if (!isEmpty(result)) {
				result.forEach((e) => {
					if (e.permission)
						permissions = concat(
							permissions,
							e.permission.split(','),
						);
				});
				permissions = uniq(permissions);
			}
		}

		return permissions;
	}

	/**
	 * Elimina múltiples menús
	 */
	async deleteMenuItem(mids: number[]): Promise<void> {
		await this.menuRepository.delete(mids);
	}

	/**
	 * Actualiza los permisos de un usuario específico
	 */
	async refreshPerms(uid: string): Promise<void> {
		// const permissions = await this.getPermissions(uid);
	}

	/**
	 * Actualiza los permisos de todos los usuarios en línea
	 */
	async refreshOnlineUserPerms(): Promise<void> {
		const onlineUserIds: string[] = [];
	}

	/**
	 * Comprueba si un menú está asociado a algún rol
	 */
	async checkRoleByMenuId(id: string): Promise<boolean> {
		return !!(await this.menuRepository.findOne({
			where: {
				roles: {
					id,
				},
			},
		}));
	}
}
