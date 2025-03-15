import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';
import { env } from './core/global/env';
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
				const extractErrorMessages = (error) => {
					// Si hay constraints, extrae los mensajes
					if (error.constraints) {
						return Object.values(error.constraints);
					}

					// Si hay children, extrae recursivamente los mensajes de cada hijo
					if (error.children && error.children.length > 0) {
						return error.children.flatMap(child => extractErrorMessages(child));
					}

					// Si no hay ni constraints ni children, retorna un array vacío
					return [];
				};

				const errorMessages = errors.map(error => ({
					property: error.property,
					errors: extractErrorMessages(error),
				}));

				return new UnprocessableEntityException({
					message: 'Validation failed',
					errors: errorMessages,
				});
			},
		}),
	);

	setupSwagger(app, configService); // Llama a setupSwagger pasando la app y el ConfigService

	await app.listen(env('PORT'));
}
bootstrap();
