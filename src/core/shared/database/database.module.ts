import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, LoggerOptions } from 'typeorm';

import { ConfigKeyPaths, IDatabaseConfig } from '../../config';
import { env } from '../../global/env';
import { EntityExistConstraint } from './constraints/entity-exist.constraint';
import { UniqueConstraint } from './constraints/unique.constraint';
import { TypeORMLogger } from './typeorm-logger';

// Lista de proveedores de servicios
const providers = [EntityExistConstraint, UniqueConstraint];

@Module({
	imports: [
		// Importa el módulo TypeOrmModule de manera asíncrona para configurar la conexión a la base de datos
		TypeOrmModule.forRootAsync({
			inject: [ConfigService], // Inyecta el servicio ConfigService
			// La función useFactory se utiliza para crear la configuración de TypeORM de manera dinámica
			useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
				let loggerOptions: LoggerOptions = env('DB_LOGGING') as 'all';

				try {
					// Intenta parsear la opción de logging como un JSON array
					loggerOptions = JSON.parse(loggerOptions);
				} catch {
					// En caso de error al parsear, ignora
				}

				// Retorna la configuración de TypeORM combinando la configuración de base de datos
				// obtenida del servicio ConfigService, junto con otras opciones como autoLoadEntities, logging y logger
				return {
					...configService.get<IDatabaseConfig>('database'), // Obtiene la configuración de la base de datos desde ConfigService
					autoLoadEntities: true,
					logging: loggerOptions,
					logger: new TypeORMLogger(loggerOptions), // Utiliza el logger personalizado TypeORMLogger
				};
			},
			// La función dataSourceFactory se utiliza para configurar la fuente de datos (DataSource)
			dataSourceFactory: async (options) => {
				const dataSource = await new DataSource(options).initialize(); // Inicializa la DataSource con las opciones proporcionadas
				return dataSource;
			},
		}),
	],
	providers, // Define los proveedores de servicios que se exportarán
	exports: providers, // Exporta los proveedores de servicios para que estén disponibles en otros módulos
})
export class DatabaseModule {} // Exporta el módulo DatabaseModule
