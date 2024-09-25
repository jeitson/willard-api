import {
	CallHandler,
	ExecutionContext,
	Injectable,
	Logger,
	NestInterceptor,
} from '@nestjs/common';
import { Observable, tap, catchError } from 'rxjs';
import { AuditsService } from 'src/modules/audits/audits.service';
import { throwError } from 'rxjs';

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

		const statusCode = response.statusCode;
		const userId = request.user?.id || '1';

		return next.handle().pipe(
			tap(async (resData) => {
				if (isSse) return;

				const consoleResponse = `--- Response:${content} +${Date.now() - now}ms`;
				this.logger.debug(consoleResponse);


				if (request.method !== 'GET') {
					this.createLog({ request, userId, response: resData, statusCode})
				}

				return resData;
			}),
			catchError((error) => {
				const consoleError = `*** Error in ${content}: ${error.message}`;
				this.logger.error(consoleError);

				this.createLog({ request, userId, response: error, statusCode})

				return throwError(() => error);
			}),
		);
	}

	private async createLog({ request, userId, response, statusCode }): Promise<void> {
		await this.auditsService.create({
			title: `${request.url.replaceAll('/', '-').toUpperCase()}::${request.method}`,
			description: `Request made to ${request.url}::${request.method}`,
			userId: userId,
			payload: JSON.stringify(request.body),
			response: typeof response === 'string' ? response : JSON.stringify(response.response),
			statusCode: statusCode.toString(),
			method: request.method,
		});
	}
}
