import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { QueryFailedError } from 'typeorm';
import { BusinessException } from '../common/exceptions/biz.exception';
import { ErrorEnum } from '../constants/error-code.constant';
import { isDev } from '../global/env';

interface myError {
	readonly status: number;
	readonly statusCode?: number;

	readonly message?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger(AllExceptionsFilter.name);

	constructor() {
		this.registerCatchAllExceptionsHook();
	}

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<FastifyRequest>();
		const response = ctx.getResponse<FastifyReply>();

		const url = request.raw.url!;

		const status = this.getStatus(exception);
		let message = this.getErrorMessage(exception);

		// En caso de error interno del sistema
		if (
			status === HttpStatus.INTERNAL_SERVER_ERROR &&
			!(exception instanceof BusinessException)
		) {
			Logger.error(exception, undefined, 'Catch');

			// Ocultar mensajes de error en un entorno de producción
			if (!isDev) message = ErrorEnum.SERVER_ERROR?.split(':')[1];
		} else {
			this.logger.warn(
				`Message: (${status}) ${message} Path: ${decodeURI(url)}`,
			);
		}

		const apiErrorCode =
			exception instanceof BusinessException
				? exception.getErrorCode()
				: status;

		// Devuelve el resultado de la respuesta base
		const resBody: IBaseResponse = {
			code: apiErrorCode,
			message,
			data: null,
		};

		response.status(status).send(resBody);
	}

	getStatus(exception: unknown): number {
		if (exception instanceof HttpException) {
			return exception.getStatus();
		} else if (exception instanceof QueryFailedError) {
			// console.log('driverError', exception.driverError.code)
			return HttpStatus.INTERNAL_SERVER_ERROR;
		} else {
			return (
				(exception as myError)?.status ??
				(exception as myError)?.statusCode ??
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	getErrorMessage(exception: unknown): string {
		if (exception instanceof HttpException) {
			return exception.message;
		} else if (exception instanceof QueryFailedError) {
			return exception.message;
		} else {
			return (
				(exception as any)?.response?.message ??
				(exception as myError)?.message ??
				`${exception}`
			);
		}
	}

	registerCatchAllExceptionsHook() {
		process.on('unhandledRejection', (reason) => {
			console.error('unhandledRejection: ', reason);
		});

		process.on('uncaughtException', (err) => {
			console.error('uncaughtException: ', err);
		});
	}
}
