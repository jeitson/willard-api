import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';
import { env, isDev } from './core/global/env';
import { LoggingInterceptor } from './core/common/interceptors/logging.interceptor';
import {
	HttpStatus,
	UnprocessableEntityException,
	ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	app.setGlobalPrefix('api');

	app.enableCors();

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			transformOptions: { enableImplicitConversion: true },
			errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
			stopAtFirstError: false, // Procesa todos los errores en lugar de detenerse en el primero
			exceptionFactory: errors => {
				const errorMessages = errors.map(error => {
					const constraints = error.constraints
						? Object.values(error.constraints)
						: [];
					return {
						property: error.property,
						errors: constraints,
					};
				});

				return new UnprocessableEntityException({
					message: 'Validation failed',
					errors: errorMessages,
				});
			},
		}),
	);

	// app.useGlobalInterceptors(new LoggingInterceptor());
	// if (isDev) app.useGlobalInterceptors(new LoggingInterceptor());

	setupSwagger(app, configService); // Llama a setupSwagger pasando la app y el ConfigService

	await app.listen(env('PORT'));
}
bootstrap();
