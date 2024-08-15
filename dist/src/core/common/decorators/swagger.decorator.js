"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_SECURITY_AUTH = void 0;
exports.ApiSecurityAuth = ApiSecurityAuth;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
exports.API_SECURITY_AUTH = 'auth';
function ApiSecurityAuth() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)(exports.API_SECURITY_AUTH));
}
//# sourceMappingURL=swagger.decorator.js.map