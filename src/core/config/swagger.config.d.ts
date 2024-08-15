import { ConfigType } from '@nestjs/config';
export declare const swaggerRegToken = "swagger";
export declare const SwaggerConfig: (() => {
    enable: boolean;
    path: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    enable: boolean;
    path: string;
}>;
export type ISwaggerConfig = ConfigType<typeof SwaggerConfig>;
