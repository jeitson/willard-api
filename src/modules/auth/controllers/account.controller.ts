/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Body,
	Controller,
	Get,
	Post,
	Put,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { ApiResult } from 'src/core/common/decorators/api-result.decorator';

import { ApiSecurityAuth } from 'src/core/common/decorators/swagger.decorator';
import { AllowAnon } from 'src/modules/auth/decorators/allow-anon.decorator';
import { AuthUser } from 'src/modules/auth/decorators/auth-user.decorator';

import { PasswordUpdateDto } from 'src/modules/user/dto/password.dto';

import { AccountInfo } from '../../user/user.model';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import { AccountMenus, AccountUpdateDto } from '../dto/account.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Cuentas - Módulo de cuentas') // Etiqueta para el controlador en Swagger
@ApiSecurityAuth() // Especifica que se requiere autenticación en Swagger
@ApiExtraModels(AccountInfo) // Modelos adicionales utilizados por Swagger
@UseGuards(JwtAuthGuard) // Aplica el guardia JwtAuthGuard a todo el controlador
@Controller('account') // Controlador para las operaciones de la cuenta de usuario
export class AccountController {
	constructor(
		private userService: UserService,
		private authService: AuthService,
	) {}

	// Obtener el perfil de la cuenta del usuario
	@Get('profile')
	@ApiOperation({ summary: 'Obtener información de la cuenta' })
	@ApiResult({ type: AccountInfo }) // Especifica el tipo de respuesta para Swagger
	@AllowAnon() // Permite acceso anónimo a este método
	async profile(@AuthUser() user: IAuthUser): Promise<AccountInfo> {
		return this.userService.getAccountInfo(user.uid);
	}

	// Realizar acción de cierre de sesión
	@Get('logout')
	@ApiOperation({ summary: 'Cerrar sesión' })
	@AllowAnon() // Permite acceso anónimo a este método
	async logout(
		@AuthUser() user: IAuthUser,
		@Req() req: FastifyRequest,
	): Promise<void> {
		return; // Implementación de cierre de sesión
	}

	// Obtener la lista de menús asociados con la cuenta del usuario
	@Get('menus')
	@ApiOperation({ summary: 'Obtener lista de menús' })
	@ApiResult({ type: [AccountMenus] }) // Especifica el tipo de respuesta para Swagger
	@AllowAnon() // Permite acceso anónimo a este método
	async menu(@AuthUser() user: IAuthUser) {
		return []; // Retorna una lista vacía de menús (implementación necesaria)
	}

	// Obtener la lista de permisos del usuario actual
	@Get('permissions')
	@ApiOperation({ summary: 'Obtener lista de permisos' })
	@ApiResult({ type: [String] }) // Especifica el tipo de respuesta para Swagger
	@AllowAnon() // Permite acceso anónimo a este método
	async permissions(@AuthUser() user: IAuthUser): Promise<string[]> {
		return; // Implementación para obtener permisos del usuario
	}

	// Actualizar la información de la cuenta del usuario
	@Put('update')
	@ApiOperation({ summary: 'Actualizar información de la cuenta' })
	@AllowAnon() // Permite acceso anónimo a este método
	async update(
		@AuthUser() user: IAuthUser,
		@Body() dto: AccountUpdateDto,
	): Promise<void> {
		return; // Implementación para actualizar la información de la cuenta
	}

	// Cambiar la contraseña de la cuenta del usuario
	@Post('password')
	@ApiOperation({ summary: 'Cambiar contraseña de la cuenta' })
	@AllowAnon() // Permite acceso anónimo a este método
	async password(
		@AuthUser() user: IAuthUser,
		@Body() dto: PasswordUpdateDto,
	): Promise<void> {
		await this.userService.updatePassword(user.uid, dto); // Llama al servicio para cambiar la contraseña
	}
}
