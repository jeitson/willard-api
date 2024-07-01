import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';

import { ISecurityConfig, SecurityConfig } from 'src/core/config';
import { RoleService } from 'src/modules/system/role/role.service';
import { UserEntity } from 'src/modules/user/user.entity';

import { AccessTokenEntity } from '../entities/access-token.entity';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { generateUUID } from 'src/core/utils';

/**
 * Servicio de tokens
 */
@Injectable()
export class TokenService {
	constructor(
		private jwtService: JwtService,
		private roleService: RoleService,
		@Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
	) {}

	/**
	 * Refresca AccessToken y RefreshToken basado en el AccessToken existente
	 * @param accessToken
	 */
	async refreshToken(accessToken: AccessTokenEntity) {
		const { user, refreshToken } = accessToken;

		if (refreshToken) {
			const now = dayjs();
			// Verifica si RefreshToken ha expirado
			if (now.isAfter(refreshToken.expired_at)) return null;

			const roleIds = await this.roleService.getRoleIdsByUser(user.id);
			const roleValues = await this.roleService.getRoleValues(roleIds);

			// Genera nuevos AccessToken y RefreshToken si no ha expirado
			const token = await this.generateAccessToken(user.id, roleValues);

			await accessToken.remove();
			return token;
		}
		return null;
	}

	generateJwtSign(payload: any) {
		const jwtSign = this.jwtService.sign(payload);

		return jwtSign;
	}

	async generateAccessToken(uid: string, roles: string[] = []) {
		const payload: IAuthUser = {
			uid,
			pv: 1,
			roles,
		};

		const jwtSign = await this.jwtService.signAsync(payload);

		// Genera AccessToken
		const accessToken = new AccessTokenEntity();
		accessToken.value = jwtSign;
		accessToken.user = { id: uid } as UserEntity;
		accessToken.expired_at = dayjs()
			.add(this.securityConfig.jwtExprire, 'second')
			.toDate();

		await accessToken.save();

		// Genera RefreshToken
		const refreshToken = await this.generateRefreshToken(
			accessToken,
			dayjs(),
		);

		return {
			accessToken: jwtSign,
			refreshToken,
		};
	}

	/**
	 * Genera un nuevo RefreshToken y lo guarda en la base de datos
	 * @param accessToken
	 * @param now
	 */
	async generateRefreshToken(
		accessToken: AccessTokenEntity,
		now: dayjs.Dayjs,
	): Promise<string> {
		const refreshTokenPayload = {
			uuid: generateUUID(),
		};

		const refreshTokenSign = await this.jwtService.signAsync(
			refreshTokenPayload,
			{
				secret: this.securityConfig.refreshSecret,
			},
		);

		const refreshToken = new RefreshTokenEntity();
		refreshToken.value = refreshTokenSign;
		refreshToken.expired_at = now
			.add(this.securityConfig.refreshExpire, 'second')
			.toDate();
		refreshToken.accessToken = accessToken;

		await refreshToken.save();

		return refreshTokenSign;
	}

	/**
	 * Verifica si AccessToken existe y está dentro del periodo válido
	 * @param value
	 */
	async checkAccessToken(value: string) {
		let isValid = false;
		try {
			await this.verifyAccessToken(value);
			const res = await AccessTokenEntity.findOne({
				where: { value },
				relations: ['user', 'refreshToken'],
				cache: true,
			});
			isValid = Boolean(res);
		} catch (error) {}

		return isValid;
	}

	/**
	 * Elimina AccessToken y automáticamente elimina RefreshToken asociado
	 * @param value
	 */
	async removeAccessToken(value: string) {
		const accessToken = await AccessTokenEntity.findOne({
			where: { value },
		});
		if (accessToken) {
			await accessToken.remove();
		}
	}

	/**
	 * Elimina RefreshToken
	 * @param value
	 */
	async removeRefreshToken(value: string) {
		const refreshToken = await RefreshTokenEntity.findOne({
			where: { value },
			relations: ['accessToken'],
		});
		if (refreshToken) {
			if (refreshToken.accessToken) return;
			await refreshToken.accessToken.remove();
			await refreshToken.remove();
		}
	}

	/**
	 * Verifica si el Token es correcto y retorna el objeto de usuario asociado
	 * @param token
	 */
	async verifyAccessToken(token: string): Promise<IAuthUser> {
		try {
			const decoded = await this.jwtService.verifyAsync(token);
			return decoded as IAuthUser; // Asumiendo que el payload es un objeto de usuario
		} catch (error) {
			console.error('Token verification failed:', error);
			throw new UnauthorizedException('Token verification failed'); // Lanzar una excepción no autorizada
		}
	}
}
