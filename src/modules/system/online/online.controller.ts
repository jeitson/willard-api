import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';

import { FastifyRequest } from 'fastify';

import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { ApiSecurityAuth } from 'src/core/common/decorators/swagger.decorator';

import { AuthUser } from 'src/modules/auth/decorators/auth-user.decorator';

import {
	Perm,
	definePermission,
} from 'src/modules/auth/decorators/permission.decorator';

import { KickDto } from './online.dto';
import { OnlineUserInfo } from './online.model';
import { OnlineService } from './online.service';

// Definir permisos específicos para el controlador de usuarios en línea
export const permissions = definePermission('system:online', [
	'list',
	'kick',
] as const);

@ApiTags('Sistema - Módulo de Usuarios en Línea')
@ApiSecurityAuth()
@ApiExtraModels(OnlineUserInfo)
@Controller('online')
export class OnlineController {
	constructor(private onlineService: OnlineService) {}

	// Endpoint para listar usuarios en línea
	@Get('list')
	@ApiOperation({ summary: 'Consultar usuarios en línea actualmente' })
	@ApiResult({ type: [OnlineUserInfo] })
	@Perm(permissions.LIST)
	async list(@Req() req: FastifyRequest): Promise<OnlineUserInfo[]> {
		return this.onlineService.listOnlineUser(req.accessToken);
	}

	// Endpoint para desconectar a un usuario en línea específico
	@Post('kick')
	@ApiOperation({ summary: 'Desconectar a un usuario en línea específico' })
	@Perm(permissions.KICK)
	async kick(
		@Body() dto: KickDto,
		@AuthUser() user: IAuthUser,
	): Promise<void> {
		await this.onlineService.kickUser(dto.tokenId, user);
	}
}
