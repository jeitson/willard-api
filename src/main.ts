import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger'; // Asegúrate de ajustar la ruta correcta
import { LoggingInterceptor } from './core/common/interceptors/logging.interceptor';
import { HttpStatus, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { isDev } from './core/global/env';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	app.enableCors();

	app.useGlobalPipes(
		new ValidationPipe({
		  transform: true,
		  whitelist: true,
		  transformOptions: { enableImplicitConversion: true },
		  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
		  stopAtFirstError: true,
		  exceptionFactory: errors =>
			new UnprocessableEntityException(
			  errors.map((e) => {
				const rule = Object.keys(e.constraints!)[0]
				const msg = e.constraints![rule]
				return msg
			  })[0],
			),
		}),
	  );

	if (isDev)
		app.useGlobalInterceptors(new LoggingInterceptor())

	setupSwagger(app, configService); // Llama a setupSwagger pasando la app y el ConfigService

	await app.listen(3000);
}
bootstrap();
