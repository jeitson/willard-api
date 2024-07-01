import {
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
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/core/constants/error-code.constant';
import { AuthUser } from 'src/modules/auth/decorators/auth-user.decorator';
import {
	Perm,
	definePermission,
} from 'src/modules/auth/decorators/permission.decorator';
import { DeptEntity } from 'src/modules/system/dept/dept.entity';

import { DeptDto, DeptQueryDto } from './dept.dto';
import { DeptService } from './dept.service';

// Define permissions for department operations
export const permissions = definePermission('system:dept', {
	LIST: 'list',
	CREATE: 'create',
	READ: 'read',
	UPDATE: 'update',
	DELETE: 'delete',
} as const);

// Controller for managing departments
@ApiSecurityAuth()
@ApiTags('Sistema - Módulo de departamento')
@Controller('depts')
export class DeptController {
	constructor(private deptService: DeptService) {}

	// Get department list
	@Get()
	@ApiOperation({ summary: 'Listado de departamentos' })
	@ApiResult({ type: [DeptEntity] })
	@Perm(permissions.LIST)
	async list(
		@Query() dto: DeptQueryDto,
		@AuthUser('uid') uid: string,
	): Promise<DeptEntity[]> {
		return this.deptService.getDeptTree(uid, dto);
	}

	// Create department
	@Post()
	@ApiOperation({ summary: 'Crear departamento' })
	@Perm(permissions.CREATE)
	async create(@Body() dto: DeptDto): Promise<void> {
		await this.deptService.create(dto);
	}

	// Get department information by ID
	@Get(':id')
	@ApiOperation({ summary: 'Obtener departamento por ID' })
	@Perm(permissions.READ)
	async info(@IdParam() id: string) {
		return this.deptService.info(id);
	}

	// Update department
	@Put(':id')
	@ApiOperation({ summary: 'Actualizar departamento' })
	@Perm(permissions.UPDATE)
	async update(
		@IdParam() id: string,
		@Body() updateDeptDto: DeptDto,
	): Promise<void> {
		await this.deptService.update(id, updateDeptDto);
	}

	// Delete department
	@Delete(':id')
	@ApiOperation({ summary: 'Eleminar departamento' })
	@Perm(permissions.DELETE)
	async delete(@IdParam() id: string): Promise<void> {
		// Check if the department has associated users
		const userCount = await this.deptService.countUserByDeptId(id);
		if (userCount > 0) {
			throw new BusinessException(
				ErrorEnum.DEPARTMENT_HAS_ASSOCIATED_USERS,
			);
		}

		// Check if the department has child departments
		const childDeptCount = await this.deptService.countChildDept(id);
		if (childDeptCount > 0) {
			throw new BusinessException(
				ErrorEnum.DEPARTMENT_HAS_CHILD_DEPARTMENTS,
			);
		}

		// If no associated users or child departments, delete the department
		await this.deptService.delete(id);
	}

	// Endpoint for moving departments (commented out for now)
	// @Post('move')
	// @ApiOperation({ summary: 'Department movement and sorting' })
	// async move(@Body() dto: MoveDeptDto): Promise<void> {
	//   await this.deptService.move(dto.depts);
	// }
}
