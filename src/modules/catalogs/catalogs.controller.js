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
exports.CatalogsController = void 0;
const common_1 = require("@nestjs/common");
const catalogs_service_1 = require("./catalogs.service");
const swagger_1 = require("@nestjs/swagger");
const child_dto_1 = require("./dto/child.dto");
const id_param_decorator_1 = require("../../core/common/decorators/id-param.decorator");
let CatalogsController = class CatalogsController {
    constructor(catalogsService) {
        this.catalogsService = catalogsService;
    }
    async create(dto) {
        await this.catalogsService.createChild(dto);
    }
    async update(id, updateChildDto) {
        return await this.catalogsService.updateChild(+id, updateChildDto);
    }
    async changeOrder(id, order) {
        return await this.catalogsService.changeOrder(+id, order);
    }
    async changeParent(id, parentId) {
        return await this.catalogsService.changeParent(+id, +parentId);
    }
    async changeStatus(id) {
        return await this.catalogsService.changeStatus(+id);
    }
    async delete(id) {
        await this.catalogsService.deleteChild(+id);
    }
    async getById(id) {
        return await this.catalogsService.getChildById(+id);
    }
    async getByKey(key) {
        return await this.catalogsService.getChildrenByKey(key);
    }
    async getByKeyAndParentId(key, id) {
        return await this.catalogsService.getChildrenByKeyAndParent(key, +id);
    }
    async searchByKeys({ keys }) {
        return await this.catalogsService.getChildrenByKeys(keys);
    }
};
exports.CatalogsController = CatalogsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear hijos de catalogos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [child_dto_1.ChildDto]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar catalogo' }),
    __param(0, (0, id_param_decorator_1.IdParam)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, child_dto_1.ChildUpdateDto]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/change-order/:order'),
    (0, swagger_1.ApiOperation)({ summary: 'Cambiar de orden' }),
    __param(0, (0, id_param_decorator_1.IdParam)()),
    __param(1, (0, id_param_decorator_1.IdParam)('order')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "changeOrder", null);
__decorate([
    (0, common_1.Put)(':id/change-parent/:parentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Cambiar de padre' }),
    __param(0, (0, id_param_decorator_1.IdParam)()),
    __param(1, (0, id_param_decorator_1.IdParam)('parentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "changeParent", null);
__decorate([
    (0, common_1.Put)(':id/change-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Cambiar de estados' }),
    __param(0, (0, id_param_decorator_1.IdParam)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "changeStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar hijo' }),
    __param(0, (0, id_param_decorator_1.IdParam)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener hijo por su ID' }),
    __param(0, (0, id_param_decorator_1.IdParam)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)('key/:key'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener hijos por su llave - KEY' }),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "getByKey", null);
__decorate([
    (0, common_1.Get)('key/:key/parent/:parentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener hijos por su llave - KEY y su padre' }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, id_param_decorator_1.IdParam)('parentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "getByKeyAndParentId", null);
__decorate([
    (0, common_1.Post)('search-by-keys'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar hijos de catalogos por sus padres' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [child_dto_1.ChildSearchDto]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "searchByKeys", null);
exports.CatalogsController = CatalogsController = __decorate([
    (0, swagger_1.ApiTags)('Sistema - Catalogos'),
    (0, common_1.Controller)('catalogs'),
    __metadata("design:paramtypes", [catalogs_service_1.CatalogsService])
], CatalogsController);
//# sourceMappingURL=catalogs.controller.js.map