import { IAppConfig, appRegToken } from './app.config';
import { IDatabaseConfig, dbRegToken } from './database.config';
import { IMailerConfig, mailerRegToken } from './mailer.config';
import { ISecurityConfig, securityRegToken } from './security.config';
import { ISwaggerConfig, swaggerRegToken } from './swagger.config';
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
declare const _default: {
    AppConfig: (() => {
        name: string;
        port: number;
        baseUrl: string;
        globalPrefix: string;
        locale: string;
        multiDeviceLogin: boolean;
    }) & import("@nestjs/config").ConfigFactoryKeyHost<{
        name: string;
        port: number;
        baseUrl: string;
        globalPrefix: string;
        locale: string;
        multiDeviceLogin: boolean;
    }>;
    DatabaseConfig: (() => import("typeorm").DataSourceOptions) & import("@nestjs/config").ConfigFactoryKeyHost<import("typeorm").DataSourceOptions>;
    MailerConfig: (() => {
        host: string;
        port: number;
        ignoreTLS: boolean;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    }) & import("@nestjs/config").ConfigFactoryKeyHost<{
        host: string;
        port: number;
        ignoreTLS: boolean;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    }>;
    SecurityConfig: (() => {
        jwtSecret: string;
        jwtExprire: number;
        refreshSecret: string;
        refreshExpire: number;
    }) & import("@nestjs/config").ConfigFactoryKeyHost<{
        jwtSecret: string;
        jwtExprire: number;
        refreshSecret: string;
        refreshExpire: number;
    }>;
    SwaggerConfig: (() => {
        enable: boolean;
        path: string;
    }) & import("@nestjs/config").ConfigFactoryKeyHost<{
        enable: boolean;
        path: string;
    }>;
};
export default _default;
