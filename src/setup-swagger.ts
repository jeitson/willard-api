import { INestApplication, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { ConfigKeyPaths, IAppConfig, ISwaggerConfig } from './core/config'
import { API_SECURITY_AUTH } from './core/common/decorators/swagger.decorator'
import { ResOp, TreeResult } from './core/common/model/response.model'

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
		.setVersion('1.0')
		.addBearerAuth()  // Aplica Bearer Auth a todas las rutas

	const document = SwaggerModule.createDocument(app, documentBuilder.build(), {
		ignoreGlobalPrefix: false,
		extraModels: [ResOp, TreeResult],
	});

	SwaggerModule.setup(path, app, document, {
		swaggerOptions: {
			persistAuthorization: true,
			authAction: {
				API_SECURITY_AUTH: {
					name: API_SECURITY_AUTH,
					schema: {
						type: 'http',
						in: 'header',
						name: 'Authorization',
						description: 'Bearer token',
					},
					value: 'Bearer <your-token>',
				},
			},
		},
	});

	const logger = new Logger('SwaggerModule');
	logger.log(`Document running on http://127.0.0.1:${port}/${path}`);
}
