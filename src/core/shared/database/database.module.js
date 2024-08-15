"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const env_1 = require("../../global/env");
const entity_exist_constraint_1 = require("./constraints/entity-exist.constraint");
const unique_constraint_1 = require("./constraints/unique.constraint");
const typeorm_logger_1 = require("./typeorm-logger");
const providers = [entity_exist_constraint_1.EntityExistConstraint, unique_constraint_1.UniqueConstraint];
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    let loggerOptions = (0, env_1.env)('DB_LOGGING');
                    try {
                        loggerOptions = JSON.parse(loggerOptions);
                    }
                    catch {
                    }
                    return {
                        ...configService.get('database'),
                        autoLoadEntities: true,
                        logging: loggerOptions,
                        logger: new typeorm_logger_1.TypeORMLogger(loggerOptions),
                    };
                },
                dataSourceFactory: async (options) => {
                    const dataSource = await new typeorm_2.DataSource(options).initialize();
                    return dataSource;
                },
            }),
        ],
        providers,
        exports: providers,
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map