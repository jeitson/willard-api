import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/core/constants/error-code.constant';
import { AuthService } from 'src/modules/auth/auth.service';

import {
	ALLOW_ANON_KEY,
	PERMISSION_KEY,
	PUBLIC_KEY,
	Roles,
} from '../auth.constant';

@Injectable()
export class RbacGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private authService: AuthService,
	) {}

	async canActivate(context: ExecutionContext): Promise<any> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) return true;

		const request = context.switchToHttp().getRequest<FastifyRequest>();

		const { user } = request;
		if (!user) throw new BusinessException(ErrorEnum.INVALID_LOGIN);

		const allowAnon = this.reflector.get<boolean>(
			ALLOW_ANON_KEY,
			context.getHandler(),
		);
		if (allowAnon) return true;

		const payloadPermission = this.reflector.getAllAndOverride<
			string | string[]
		>(PERMISSION_KEY, [context.getHandler(), context.getClass()]);


		if (!payloadPermission) return true;

		if (user.roles.map(r => r.toLowerCase()).includes(Roles.ADMIN.toLowerCase())) return true;

		const allPermissions = []; // Aquí deberías llenar allPermissions con los permisos del usuario

		let canProceed = false;

		if (Array.isArray(payloadPermission)) {
			canProceed = payloadPermission.some((permission) =>
				allPermissions.includes(permission),
			);
		}

		if (typeof payloadPermission === 'string') {
			canProceed = allPermissions.includes(payloadPermission);
		}

		if (!canProceed) throw new BusinessException(ErrorEnum.NO_PERMISSION);

		return true;
	}
}
