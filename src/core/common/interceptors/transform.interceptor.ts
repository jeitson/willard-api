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


import { ResOp } from '../model/response.model';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
	constructor(private readonly reflector: Reflector) {}

	intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> {

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
