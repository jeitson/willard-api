"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerConfig = exports.swaggerRegToken = void 0;
const config_1 = require("@nestjs/config");
const env_1 = require("../global/env");
exports.swaggerRegToken = 'swagger';
exports.SwaggerConfig = (0, config_1.registerAs)(exports.swaggerRegToken, () => ({
    enable: (0, env_1.envBoolean)('SWAGGER_ENABLE'),
    path: (0, env_1.env)('SWAGGER_PATH'),
}));
//# sourceMappingURL=swagger.config.js.map