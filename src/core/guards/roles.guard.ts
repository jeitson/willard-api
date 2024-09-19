import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/modules/users/users.service';
import { ROLES_KEY } from '../common/decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly usersService: UsersService,
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
				context.getHandler(),
				context.getClass(),
			]);

			if (!roles) {
				return true;
			}

			const request = context.switchToHttp().getRequest();
			const user = request.user;

			if (!user) {
				throw new ForbiddenException('No se encontró un usuario autenticado.');
			}

			const userRoles = await this.usersService.getUserRoles(user.sub);

			const hasRole = () => userRoles.some(role => roles.includes(role));

			if (!hasRole()) {
				throw new ForbiddenException('No tienes permisos para acceder a este recurso.');
			}

			return true;
		} catch (error) {
			return false;
		}
	}
}
