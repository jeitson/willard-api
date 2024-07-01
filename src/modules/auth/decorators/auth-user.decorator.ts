import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

type Payload = keyof IAuthUser;

/**
 * Decorador para obtener información del usuario autenticado desde el contexto de ejecución.
 * @param data Propiedad específica del usuario que se desea obtener (opcional).
 * @param ctx Contexto de ejecución de NestJS.
 */
export const AuthUser = createParamDecorator(
	(data: Payload, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<FastifyRequest>();
		const user = request.user as IAuthUser;

		return data ? user?.[data] : user;
	},
);
