/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';

import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import {
	AppConfig,
	IAppConfig,
	ISecurityConfig,
	SecurityConfig,
} from 'src/core/config';
import { ErrorEnum } from 'src/core/constants/error-code.constant';


import { UserService } from 'src/modules/user/user.service';
import { MenuService } from '../system/menu/menu.service';
import { RoleService } from '../system/role/role.service';
import { TokenService } from './services/token.service';
import { md5 } from 'src/core/utils';

@Injectable()
export class AuthService {
	constructor(
		private menuService: MenuService,
		private roleService: RoleService,
		private userService: UserService,
		private tokenService: TokenService,
		@Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
		@Inject(AppConfig.KEY) private appConfig: IAppConfig,
	) {}

	async validateUser(credential: string, password: string): Promise<any> {
		const user = await this.userService.findUserByUserName(credential);

		if (isEmpty(user))
			throw new BusinessException(ErrorEnum.USER_NOT_FOUND);

		const comparePassword = md5(`${password}${user.psalt}`);
		if (user.password !== comparePassword)
			throw new BusinessException(ErrorEnum.INVALID_EMAIL_PASSWORD);

		if (user) {
			const { password, ...result } = user;
			return result;
		}

		return null;
	}

	/**
	 * Obtener JWT de inicio de sesión
	 * Retorna null si las credenciales son incorrectas o el usuario no existe
	 */
	async login(
		email: string,
		password: string,
	): Promise<string> {
		const user = await this.userService.findUserByEmail(email);
		if (isEmpty(user))
			throw new BusinessException(ErrorEnum.INVALID_EMAIL_PASSWORD);

		const comparePassword = md5(`${password}${user.psalt}`);
		if (user.password !== comparePassword)
			throw new BusinessException(ErrorEnum.INVALID_EMAIL_PASSWORD);

		const roleIds = await this.roleService.getRoleIdsByUser(user.id);

		const roles = await this.roleService.getRoleValues(roleIds);

		// Incluye access_token y refresh_token
		const token = await this.tokenService.generateAccessToken(
			user.id,
			roles,
		);

		const permissions = await this.menuService.getPermissions(user.id);
		await this.setPermissionsCache(user.id, permissions);

		// await this.loginLogService.create(user.id, ip, ua);

		return token.accessToken;
	}

	/**
	 * Validar credenciales de cuenta
	 */
	async checkPassword(username: string, password: string) {
		const user = await this.userService.findUserByUserName(username);

		const comparePassword = md5(`${password}${user.psalt}`);
		if (user.password !== comparePassword)
			throw new BusinessException(ErrorEnum.INVALID_EMAIL_PASSWORD);
	}

	async loginLog(uid: string, ip: string, ua: string) {
		return;
	}

	/**
	 * Restablecer contraseña
	 */
	async resetPassword(username: string, password: string) {
		const user = await this.userService.findUserByUserName(username);

		await this.userService.forceUpdatePassword(user.id, password);
	}

	/**
	 * Limpiar información de inicio de sesión
	 */
	async clearLoginStatus(
		user: IAuthUser,
		accessToken: string,
	): Promise<void> {
		const exp = user.exp
			? (user.exp - Date.now() / 1000).toFixed(0)
			: this.securityConfig.jwtExprire;
		if (this.appConfig.multiDeviceLogin)
			await this.tokenService.removeAccessToken(accessToken);
		else await this.userService.forbidden(user.uid, accessToken);
	}

	/**
	 * Obtener lista de menús
	 */
	async getMenus(uid: string) {
		return this.menuService.getMenus(uid);
	}

	/**
	 * Obtener lista de permisos
	 */
	async getPermissions(uid: string): Promise<string[]> {
		return this.menuService.getPermissions(uid);
	}

	async getPermissionsCache(uid: string): Promise<string[]> {
		// const permissionString = await this.redis.get(genAuthPermKey(uid));
		return [];
	}

	async setPermissionsCache(
		uid: string,
		permissions: string[],
	): Promise<void> {
		return;
	}

	async getPasswordVersionByUid(uid: string): Promise<string> {
		return '';
	}

	async getTokenByUid(uid: string): Promise<string> {
		return '';
	}
}
