import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger'; // Asegúrate de ajustar la ruta correcta
import { LoggingInterceptor } from './core/common/interceptors/logging.interceptor';
import { BadRequestException, HttpStatus, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { env, isDev } from './core/global/env';
import { ValidationError } from 'class-validator';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	app.enableCors();

	app.useGlobalPipes(new ValidationPipe({
		whitelist: true, // Remover propiedades no definidas en el DTO
		forbidNonWhitelisted: true, // Lanza error si se encuentra una propiedad no definida en el DTO
		transform: true, // Transforma las propiedades a los tipos esperados,
		exceptionFactory: (errors: ValidationError[]) => {
			const formattedErrors = errors.map(error => {
				return {
					property: error.property,
					errors: Object.values(error.constraints),
				};
			});
			return new BadRequestException(formattedErrors);
		},
	}));

	if (isDev)
		app.useGlobalInterceptors(new LoggingInterceptor())

	setupSwagger(app, configService); // Llama a setupSwagger pasando la app y el ConfigService

	await app.listen(env('PORT'));
}
bootstrap();
