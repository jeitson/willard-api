"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionSitesModule = void 0;
const common_1 = require("@nestjs/common");
const collection_sites_service_1 = require("./collection_sites.service");
const collection_sites_controller_1 = require("./collection_sites.controller");
const typeorm_1 = require("@nestjs/typeorm");
const collection_site_entity_1 = require("./entities/collection_site.entity");
const providers = [collection_sites_service_1.CollectionSitesService];
let CollectionSitesModule = class CollectionSitesModule {
};
exports.CollectionSitesModule = CollectionSitesModule;
exports.CollectionSitesModule = CollectionSitesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([collection_site_entity_1.CollectionSite])],
        controllers: [collection_sites_controller_1.CollectionSitesController],
        providers,
        exports: [typeorm_1.TypeOrmModule, ...providers],
    })
], CollectionSitesModule);
//# sourceMappingURL=collection_sites.module.js.map