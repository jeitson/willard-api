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

	constructor(private auditsService: AuditsService) {}

	intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> {
		const call$ = next.handle();
		const request = context.switchToHttp().getRequest();
		const content = `${request.method} -> ${request.url}`;
		const isSse = request.headers.accept === 'text/event-stream';
		const consoleRequest = `+++ Request:${content}`
		this.logger.debug(consoleRequest);
		const now = Date.now();

		return call$.pipe(
			tap(async () => {
			  if (isSse) return;
			  const consoleResponse = `--- Response:${content}${` +${Date.now() - now}ms`}`

			  this.logger.debug(consoleResponse);

			  await this.auditsService.create({
				name: content,
				description: `Request made to ${content}`,
				userId: '283',
				request: consoleRequest,
				response: consoleResponse
			  });
			}),
		  );
	}
}
