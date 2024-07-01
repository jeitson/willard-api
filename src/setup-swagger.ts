import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigKeyPaths, IAppConfig, ISwaggerConfig } from './core/config';
import { API_SECURITY_AUTH } from './core/common/decorators/swagger.decorator';
import { CommonEntity } from './core/common/entity/common.entity';
import { ResOp, TreeResult } from './core/common/model/response.model';
import { Pagination } from './core/helper/paginate/pagination';


export function setupSwagger(
	app: INestApplication,
	configService: ConfigService<ConfigKeyPaths>,
): void {
	const { name, port } = configService.get<IAppConfig>('app')!;
	const { enable, path } = configService.get<ISwaggerConfig>('swagger')!;

	if (!enable) return;

	const documentBuilder = new DocumentBuilder()
		.setTitle(name)
		.setDescription(`${name} API document`)
		.setVersion('1.0');

	// auth security
	documentBuilder.addSecurity(API_SECURITY_AUTH, {
		description: 'Introduzca el token',
		type: 'http',
		scheme: 'bearer',
		bearerFormat: 'JWT',
	});

	const document = SwaggerModule.createDocument(
		app,
		documentBuilder.build(),
		{
			ignoreGlobalPrefix: false,
			extraModels: [CommonEntity, ResOp, Pagination, TreeResult],
		},
	);

	SwaggerModule.setup(path, app, document, {
		swaggerOptions: {
			persistAuthorization: true, // Permanecer conectado
		},
	});

	// started log
	const logger = new Logger('SwaggerModule');
	logger.log(`Document running on http://127.0.0.1:${port}/${path}`);
}
