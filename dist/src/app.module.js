"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const config_2 = require("./core/config");
const shared_module_1 = require("./core/shared/shared.module");
const database_module_1 = require("./core/shared/database/database.module");
const users_module_1 = require("./modules/users/users.module");
const roles_module_1 = require("./modules/roles/roles.module");
const audits_module_1 = require("./modules/audits/audits.module");
const catalogs_module_1 = require("./modules/catalogs/catalogs.module");
const collection_sites_module_1 = require("./modules/collection_sites/collection_sites.module");
const clients_module_1 = require("./modules/clients/clients.module");
const products_module_1 = require("./modules/products/products.module");
const transporters_module_1 = require("./modules/transporters/transporters.module");
const consultants_module_1 = require("./modules/consultants/consultants.module");
const transform_interceptor_1 = require("./core/common/interceptors/transform.interceptor");
const timeout_interceptor_1 = require("./core/common/interceptors/timeout.interceptor");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                expandVariables: true,
                envFilePath: ['.env'],
                load: [...Object.values(config_2.default)],
            }),
            shared_module_1.SharedModule,
            database_module_1.DatabaseModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            audits_module_1.AuditsModule,
            catalogs_module_1.CatalogsModule,
            collection_sites_module_1.CollectionSitesModule,
            clients_module_1.ClientsModule,
            products_module_1.ProductsModule,
            transporters_module_1.TransportersModule,
            consultants_module_1.ConsultantsModule,
        ],
        controllers: [],
        providers: [
            { provide: core_1.APP_INTERCEPTOR, useClass: transform_interceptor_1.TransformInterceptor },
            { provide: core_1.APP_INTERCEPTOR, useFactory: () => new timeout_interceptor_1.TimeoutInterceptor(15 * 1000) },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map