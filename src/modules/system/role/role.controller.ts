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

import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { ApiSecurityAuth } from 'src/core/common/decorators/swagger.decorator';
import {
	Perm,
	definePermission,
} from 'src/modules/auth/decorators/permission.decorator';
import { RoleEntity } from 'src/modules/system/role/role.entity';

import { MenuService } from '../menu/menu.service';

import { RoleDto, RoleUpdateDto } from './role.dto';
import { RoleInfo } from './role.model';
import { PagerDto } from 'src/core/common/dto/pager.dto';
import { RoleService } from './role.service';

// Define los permisos para el módulo de roles
export const permissions = definePermission('system:role', {
	LIST: 'list',
	CREATE: 'create',
	READ: 'read',
	UPDATE: 'update',
	DELETE: 'delete',
} as const);

@ApiTags('Sistema - Módulo de Roles')
@ApiSecurityAuth()
@Controller('roles')
export class RoleController {
	constructor(
		private roleService: RoleService,
		private menuService: MenuService,
	) {}

	// Obtiene una lista paginada de roles
	@Get()
	@ApiOperation({ summary: 'Obtener lista de roles' })
	@ApiResult({ type: [RoleEntity], isPage: true })
	@Perm(permissions.LIST)
	async list(@Query() dto: PagerDto<RoleEntity>) {
		return this.roleService.findAll(dto);
	}

	// Obtiene la información de un rol por su ID
	@Get(':id')
	@ApiOperation({ summary: 'Obtener información de un rol' })
	@ApiResult({ type: RoleInfo })
	@Perm(permissions.READ)
	async info(@IdParam() id: string) {
		return this.roleService.info(id);
	}

	// Crea un nuevo rol
	@Post()
	@ApiOperation({ summary: 'Crear un nuevo rol' })
	@Perm(permissions.CREATE)
	async create(@Body() dto: RoleDto): Promise<void> {
		await this.roleService.create(dto);
	}

	// Actualiza la información de un rol existente por su ID
	@Put(':id')
	@ApiOperation({ summary: 'Actualizar un rol existente' })
	@Perm(permissions.UPDATE)
	async update(
		@IdParam() id: string,
		@Body() dto: RoleUpdateDto,
	): Promise<void> {
		await this.roleService.update(id, dto);
		await this.menuService.refreshOnlineUserPerms(); // Actualizar permisos de usuarios en línea después de la actualización del rol
	}

	// Elimina un rol por su ID
	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar un rol' })
	@Perm(permissions.DELETE)
	async delete(@IdParam() id: string): Promise<void> {
		// Verificar si existen usuarios asociados a este rol antes de eliminarlo
		if (await this.roleService.checkUserByRoleId(id)) {
			throw new BadRequestException(
				'Este rol tiene usuarios asociados y no puede ser eliminado',
			);
		}

		await this.roleService.delete(id);
		await this.menuService.refreshOnlineUserPerms(); // Actualizar permisos de usuarios en línea después de eliminar el rol
	}
}
