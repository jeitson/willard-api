import { AppConfig, IAppConfig, appRegToken } from './app.config';
import { DatabaseConfig, IDatabaseConfig, dbRegToken } from './database.config';
import { IMailerConfig, MailerConfig, mailerRegToken } from './mailer.config';
import {
	ISecurityConfig,
	SecurityConfig,
	securityRegToken,
} from './security.config';
import {
	ISwaggerConfig,
	SwaggerConfig,
	swaggerRegToken,
} from './swagger.config';

export * from './app.config';
export * from './database.config';
export * from './swagger.config';
export * from './security.config';
export * from './mailer.config';

export interface AllConfigType {
	[appRegToken]: IAppConfig;
	[dbRegToken]: IDatabaseConfig;
	[mailerRegToken]: IMailerConfig;
	[securityRegToken]: ISecurityConfig;
	[swaggerRegToken]: ISwaggerConfig;
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;

export default {
	AppConfig,
	DatabaseConfig,
	MailerConfig,
	SecurityConfig,
	SwaggerConfig,
};
