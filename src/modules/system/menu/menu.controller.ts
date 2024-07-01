import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { flattenDeep } from 'lodash';

import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { ApiSecurityAuth } from 'src/core/common/decorators/swagger.decorator';
import {
	Perm,
	definePermission,
	getDefinePermissions,
} from 'src/modules/auth/decorators/permission.decorator';

import { MenuDto, MenuQueryDto, MenuUpdateDto } from './menu.dto';
import { MenuItemInfo } from './menu.model';
import { MenuService } from './menu.service';

export const permissions = definePermission('system:menu', {
	LIST: 'list',
	CREATE: 'create',
	READ: 'read',
	UPDATE: 'update',
	DELETE: 'delete',
} as const);

@ApiTags('Sistema - Módulo de Menús y Permisos')
@ApiSecurityAuth()
@Controller('menus')
export class MenuController {
	constructor(private menuService: MenuService) {}

	@Get()
	@ApiOperation({ summary: 'Obtener todos los menús y permisos' })
	@ApiResult({ type: [MenuItemInfo] })
	@Perm(permissions.LIST)
	async list(@Query() dto: MenuQueryDto) {
		return this.menuService.list(dto);
	}

	@Get(':id')
	@ApiOperation({
		summary: 'Obtener información detallada de un menú o permiso',
	})
	@Perm(permissions.READ)
	async info(@IdParam() id: string) {
		return this.menuService.getMenuItemAndParentInfo(id);
	}

	@Post()
	@ApiOperation({ summary: 'Agregar un nuevo menú o permiso' })
	@Perm(permissions.CREATE)
	async create(@Body() dto: MenuDto): Promise<void> {
		// Validar
		await this.menuService.check(dto);
		if (!dto.parentId) dto.parentId = null;

		await this.menuService.create(dto);
		if (dto.type === 2) {
			// Si es un cambio en los permisos, actualizar los permisos de todos los usuarios en línea
			await this.menuService.refreshOnlineUserPerms();
		}
	}

	@Put(':id')
	@ApiOperation({ summary: 'Actualizar un menú o permiso existente' })
	@Perm(permissions.UPDATE)
	async update(
		@IdParam() id: string,
		@Body() dto: MenuUpdateDto,
	): Promise<void> {
		// Validar
		await this.menuService.check(dto);
		if (!dto.parentId) dto.parentId = null;

		await this.menuService.update(id, dto);
		if (dto.type === 2) {
			// Si es un cambio en los permisos, actualizar los permisos de todos los usuarios en línea
			await this.menuService.refreshOnlineUserPerms();
		}
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar un menú o permiso' })
	@Perm(permissions.DELETE)
	async delete(@IdParam() id: string): Promise<void> {
		if (await this.menuService.checkRoleByMenuId(id))
			throw new BadRequestException(
				'Este menú está asociado a roles y no se puede eliminar',
			);

		// Eliminar también los submenús si existen
		const childMenus = await this.menuService.findChildMenus(id);
		await this.menuService.deleteMenuItem(flattenDeep([id, childMenus]));
		// Actualizar los permisos de los usuarios en línea
		await this.menuService.refreshOnlineUserPerms();
	}

	@Get('permissions')
	@ApiOperation({
		summary:
			'Obtener todos los conjuntos de permisos definidos en el backend',
	})
	async getPermissions(): Promise<string[]> {
		return getDefinePermissions();
	}
}
