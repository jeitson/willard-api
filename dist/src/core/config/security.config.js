"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityConfig = exports.securityRegToken = void 0;
const config_1 = require("@nestjs/config");
const env_1 = require("../global/env");
exports.securityRegToken = 'security';
exports.SecurityConfig = (0, config_1.registerAs)(exports.securityRegToken, () => ({
    jwtSecret: (0, env_1.env)('JWT_SECRET'),
    jwtExprire: (0, env_1.envNumber)('JWT_EXPIRE'),
    refreshSecret: (0, env_1.env)('REFRESH_TOKEN_SECRET'),
    refreshExpire: (0, env_1.envNumber)('REFRESH_TOKEN_EXPIRE'),
}));
//# sourceMappingURL=security.config.js.map