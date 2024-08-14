import { ConfigType } from '@nestjs/config';
export declare const securityRegToken = "security";
export declare const SecurityConfig: (() => {
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
export type ISecurityConfig = ConfigType<typeof SecurityConfig>;
