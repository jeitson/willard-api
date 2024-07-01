import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { ApiSecurityAuth } from 'src/core/common/decorators/swagger.decorator';
import { Pagination } from 'src/core/helper/paginate/pagination';
import {
	Perm,
	definePermission,
} from 'src/modules/auth/decorators/permission.decorator';

import {
	CaptchaLogQueryDto,
	LoginLogQueryDto,
	TaskLogQueryDto,
} from './dto/log.dto';
import { CaptchaLogEntity } from './entities/captcha-log.entity';
import { TaskLogEntity } from './entities/task-log.entity';
import { LoginLogInfo } from './models/log.model';
import { CaptchaLogService } from './services/captcha-log.service';
import { LoginLogService } from './services/login-log.service';
import { TaskLogService } from './services/task-log.service';

export const permissions = definePermission('system:log', {
	TaskList: 'task:list',
	LogList: 'login:list',
	CaptchaList: 'captcha:list',
} as const);

@ApiSecurityAuth()
@ApiTags('Sistema - Módulo de Registro')
@Controller('log')
export class LogController {
	constructor(
		private loginLogService: LoginLogService,
		private taskService: TaskLogService,
		private captchaLogService: CaptchaLogService,
	) {}

	@Get('login/list')
	@ApiOperation({
		summary: 'Consultar lista de registros de inicio de sesión',
	})
	@ApiResult({ type: [LoginLogInfo], isPage: true })
	@Perm(permissions.TaskList)
	async loginLogPage(
		@Query() dto: LoginLogQueryDto,
	): Promise<Pagination<LoginLogInfo>> {
		return this.loginLogService.list(dto);
	}

	@Get('task/list')
	@ApiOperation({ summary: 'Consultar lista de registros de tareas' })
	@ApiResult({ type: [TaskLogEntity], isPage: true })
	@Perm(permissions.LogList)
	async taskList(@Query() dto: TaskLogQueryDto) {
		return this.taskService.list(dto);
	}

	@Get('captcha/list')
	@ApiOperation({ summary: 'Consultar lista de registros de captcha' })
	@ApiResult({ type: [CaptchaLogEntity], isPage: true })
	@Perm(permissions.CaptchaList)
	async captchaList(
		@Query() dto: CaptchaLogQueryDto,
	): Promise<Pagination<CaptchaLogEntity>> {
		return this.captchaLogService.paginate(dto);
	}
}
