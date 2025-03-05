import { ConfigType, registerAs } from '@nestjs/config';

import { DataSource, DataSourceOptions } from 'typeorm';

import * as dotenv from 'dotenv';
import { env, envBoolean, envNumber } from '../global/env';

dotenv.config({ path: `.env` });

const currentScript = process.env.npm_lifecycle_event;

const dataSourceOptions: DataSourceOptions = {
	type: 'postgres',
	host: env('DB_HOST', '127.0.0.1'),
	port: envNumber('DB_PORT', 3306),
	username: env('DB_USERNAME'),
	password: env('DB_PASSWORD'),
	database: env('DB_DATABASE'),
	synchronize: envBoolean('DB_SYNCHRONIZE', false),
	logging: false,
	entities: ['dist/modules/**/*.entity{.ts,.js}'],
	migrations: ['dist/migrations/*{.ts,.js}'],
	subscribers: ['dist/modules/**/*.subscriber{.ts,.js}'],
	ssl: true
};


export const dbRegToken = 'database';

export const DatabaseConfig = registerAs(
	dbRegToken,
	(): DataSourceOptions => dataSourceOptions,
);

export type IDatabaseConfig = ConfigType<typeof DatabaseConfig>;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
