import { ConfigType } from '@nestjs/config';
export declare const appRegToken = "app";
export declare const AppConfig: (() => {
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
export type IAppConfig = ConfigType<typeof AppConfig>;
