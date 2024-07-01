import {
	Injectable,
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private readonly tokenService: TokenService) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const authToken = request.headers.authorization;

		if (['/auth/login', '/auth/register'].includes(request.originalUrl)) {
			return true;
		}

		if (!authToken || !authToken.startsWith('Bearer ')) {
			throw new UnauthorizedException('Missing or invalid token');
		}

		const token = authToken.split(' ')[1];

		try {
			const decodedUser =
				await this.tokenService.verifyAccessToken(token);
			request.user = decodedUser;

			return true;
		} catch (error) {
			throw new UnauthorizedException('Token verification failed');
		}
	}
}
