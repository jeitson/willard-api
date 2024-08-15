"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_config_1 = require("./app.config");
const database_config_1 = require("./database.config");
const mailer_config_1 = require("./mailer.config");
const security_config_1 = require("./security.config");
const swagger_config_1 = require("./swagger.config");
__exportStar(require("./app.config"), exports);
__exportStar(require("./database.config"), exports);
__exportStar(require("./swagger.config"), exports);
__exportStar(require("./security.config"), exports);
__exportStar(require("./mailer.config"), exports);
exports.default = {
    AppConfig: app_config_1.AppConfig,
    DatabaseConfig: database_config_1.DatabaseConfig,
    MailerConfig: mailer_config_1.MailerConfig,
    SecurityConfig: security_config_1.SecurityConfig,
    SwaggerConfig: swagger_config_1.SwaggerConfig,
};
//# sourceMappingURL=index.js.map