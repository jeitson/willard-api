"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = exports.appRegToken = void 0;
const config_1 = require("@nestjs/config");
const env_1 = require("../global/env");
exports.appRegToken = 'app';
exports.AppConfig = (0, config_1.registerAs)(exports.appRegToken, () => ({
    name: (0, env_1.env)('APP_NAME'),
    port: (0, env_1.envNumber)('APP_PORT', 3000),
    baseUrl: (0, env_1.env)('APP_BASE_URL'),
    globalPrefix: (0, env_1.env)('GLOBAL_PREFIX', 'api'),
    locale: (0, env_1.env)('APP_LOCALE', 'sp-CO'),
    multiDeviceLogin: (0, env_1.envBoolean)('MULTI_DEVICE_LOGIN', true),
}));
//# sourceMappingURL=app.config.js.map