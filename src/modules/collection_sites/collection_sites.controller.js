"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionSitesController = void 0;
const common_1 = require("@nestjs/common");
const collection_sites_service_1 = require("./collection_sites.service");
const collection_site_dto_1 = require("./dto/collection_site.dto");
const collection_site_entity_1 = require("./entities/collection_site.entity");
const swagger_1 = require("@nestjs/swagger");
const api_result_decorator_1 = require("../../core/common/decorators/api-result.decorator");
let CollectionSitesController = class CollectionSitesController {
    constructor(collectionSitesService) {
        this.collectionSitesService = collectionSitesService;
    }
    create(createCollectionSiteDto) {
        return this.collectionSitesService.create(createCollectionSiteDto);
    }
    async findAll(dto) {
        return this.collectionSitesService.findAll(dto);
    }
    findOne(id) {
        return this.collectionSitesService.findOne(+id);
    }
    update(id, updateCollectionSiteDto) {
        return this.collectionSitesService.update(+id, updateCollectionSiteDto);
    }
    changeStatus(id, status) {
        return this.collectionSitesService.changeStatus(+id, status);
    }
    remove(id) {
        return this.collectionSitesService.remove(+id);
    }
};
exports.CollectionSitesController = CollectionSitesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Creación de centros de acopio' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [collection_site_dto_1.CollectionSiteCreateDto]),
    __metadata("design:returntype", Promise)
], CollectionSitesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener listado de centros de acopios - Paginación' }),
    (0, api_result_decorator_1.ApiResult)({ type: [collection_site_entity_1.CollectionSite], isPage: true }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [collection_site_dto_1.CollectionSiteQueryDto]),
    __metadata("design:returntype", Promise)
], CollectionSitesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener centro de acopio por su ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CollectionSitesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar centro de acopio' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, collection_site_dto_1.CollectionSiteUpdateDto]),
    __metadata("design:returntype", Promise)
], CollectionSitesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/change-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Cambiar de estado centro de acopio' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], CollectionSitesController.prototype, "changeStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar centro de acopio' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CollectionSitesController.prototype, "remove", null);
exports.CollectionSitesController = CollectionSitesController = __decorate([
    (0, swagger_1.ApiTags)('Negocio - Centro de acopios'),
    (0, common_1.Controller)('collection-sites'),
    __metadata("design:paramtypes", [collection_sites_service_1.CollectionSitesService])
], CollectionSitesController);
//# sourceMappingURL=collection_sites.controller.js.map