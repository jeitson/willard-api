import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { ApiResult } from 'src/core/common/decorators/api-result.decorator';

import { AllowAnon } from 'src/modules/auth/decorators/allow-anon.decorator';
import { AuthUser } from 'src/modules/auth/decorators/auth-user.decorator';

import { PasswordUpdateDto } from 'src/modules/user/dto/password.dto';

import { AccountInfo } from '../../user/user.model';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import { AccountMenus, AccountUpdateDto } from '../dto/account.dto';

@ApiTags('Cuentas - Módulo de cuentas')
@ApiExtraModels(AccountInfo)
@Controller('account')
export class AccountController {
	constructor(
		private userService: UserService,
		private authService: AuthService,
	) {}

	// Obtener el perfil de la cuenta del usuario
	@Get('profile')
	@ApiOperation({ summary: 'Obtener información de la cuenta' })
	@ApiResult({ type: AccountInfo })
	@AllowAnon()
	async profile(@AuthUser() user: IAuthUser): Promise<AccountInfo> {
		return this.userService.getAccountInfo(user.uid);
	}

	// Realizar acción de cierre de sesión
	@Get('logout')
	@ApiOperation({ summary: 'Cerrar sesión' })
	@AllowAnon()
	async logout(
		@AuthUser() user: IAuthUser,
		@Req() req: FastifyRequest,
	): Promise<void> {
		await this.authService.clearLoginStatus(user, req.accessToken);
	}

	// Obtener la lista de menús asociados con la cuenta del usuario
	@Get('menus')
	@ApiOperation({ summary: 'Obtener lista de menús' })
	@ApiResult({ type: [AccountMenus] })
	@AllowAnon()
	async menu(@AuthUser() user: IAuthUser) {
		return this.authService.getMenus(user.uid);
	}

	// Obtener la lista de permisos del usuario actual
	@Get('permissions')
	@ApiOperation({ summary: 'Obtener lista de permisos' })
	@ApiResult({ type: [String] }) // Especifica el tipo de respuesta para Swagger
	@AllowAnon()
	async permissions(@AuthUser() user: IAuthUser): Promise<string[]> {
		return this.authService.getPermissions(user.uid);
	}

	// Actualizar la información de la cuenta del usuario
	@Put('update')
	@ApiOperation({ summary: 'Actualizar información de la cuenta' })
	@AllowAnon()
	async update(
		@AuthUser() user: IAuthUser,
		@Body() dto: AccountUpdateDto,
	): Promise<void> {
		await this.userService.updateAccountInfo(user.uid, dto);
	}

	// Cambiar la contraseña de la cuenta del usuario
	@Post('password')
	@ApiOperation({ summary: 'Cambiar contraseña de la cuenta' })
	@AllowAnon()
	async password(
		@AuthUser() user: IAuthUser,
		@Body() dto: PasswordUpdateDto,
	): Promise<void> {
		await this.userService.updatePassword(user.uid, dto);
	}
}
