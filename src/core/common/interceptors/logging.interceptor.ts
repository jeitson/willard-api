import {
	CallHandler,
	ExecutionContext,
	Injectable,
	Logger,
	NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditsService } from 'src/modules/audits/audits.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private logger = new Logger(LoggingInterceptor.name, { timestamp: false });

	constructor(private auditsService: AuditsService) { }

	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();
		const content = `${request.method} -> ${request.url}`;
		const isSse = request.headers.accept === 'text/event-stream';
		const consoleRequest = `+++ Request:${content}`;
		this.logger.debug(consoleRequest);

		const now = Date.now();

		return next.handle().pipe(
			tap(async (resData) => {
				if (isSse) return;

				const consoleResponse = `--- Response:${content} +${Date.now() - now}ms`;
				this.logger.debug(consoleResponse);

				const statusCode = response.statusCode;
				const userId = request.user?.id || '1';

				if (request.method !== 'GET') {
					await this.auditsService.create({
						name: `${request.url.replaceAll('/', '-').toUpperCase()}::${request.method}`,
						description: `Request made to ${request.url}::${request.method}`,
						userId: userId,
						payload: JSON.stringify(request.body),
						response: JSON.stringify(resData),
						statusCode: statusCode.toString(),
						method: request.method
					});
				}

				return resData;
			}),
		);
	}
}
