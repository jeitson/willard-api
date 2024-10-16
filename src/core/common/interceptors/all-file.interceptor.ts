import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as multer from 'multer';
import { Request, Response } from 'express';
import { multerOptions } from 'src/core/config/multer.config';

const upload = multer(multerOptions).any();

@Injectable()
export class AllFilesInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req = context.switchToHttp().getRequest<Request>();
		const res = context.switchToHttp().getResponse<Response>();

		return new Observable((observer) => {
			upload(req, res, (err: any) => {
				if (err) {
					observer.error(new BadRequestException(err.message));
				} else {
					next.handle().subscribe({
						next: (value) => observer.next(value),
						error: (err) => observer.error(err),
						complete: () => observer.complete(),
					});
				}
			});
		});
	}
}
