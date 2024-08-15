import {
	CallHandler,
	ExecutionContext,
	HttpStatus,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


import { BYPASS_KEY } from '../decorators/bypass.decorator';
import { ResOp } from '../model/response.model';

/**
 * :: Ajustar el manejo de los resultados de la interfaz de retorno, añadir @Bypass decorador si no es necesario
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
	constructor(private readonly reflector: Reflector) {}

	intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> {
		const bypass = this.reflector.get<boolean>(
			BYPASS_KEY,
			context.getHandler(),
		);

		if (bypass) return next.handle();

		return next.handle().pipe(
			map((data) => {
				// if (typeof data === 'undefined') {
				//   context.switchToHttp().getResponse().status(HttpStatus.NO_CONTENT);
				//   return data;
				// }

				return new ResOp(HttpStatus.OK, data ?? null);
			}),
		);
	}
}
