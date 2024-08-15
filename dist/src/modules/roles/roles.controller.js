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
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const roles_service_1 = require("./roles.service");
const swagger_1 = require("@nestjs/swagger");
const api_result_decorator_1 = require("../../core/common/decorators/api-result.decorator");
const id_param_decorator_1 = require("../../core/common/decorators/id-param.decorator");
const rol_dto_1 = require("./dto/rol.dto");
const rol_entity_1 = require("./entities/rol.entity");
let RolesController = class RolesController {
    constructor(rolesService) {
        this.rolesService = rolesService;
    }
    async findAll(dto) {
        return this.rolesService.findAll(dto);
    }
    async findOneById(id) {
        return this.rolesService.findOneById(+id);
    }
    async create(dto) {
        await this.rolesService.create(dto);
    }
    async update(id, dto) {
        await this.rolesService.update(+id, dto);
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener listado de todos los roles - Paginación' }),
    (0, api_result_decorator_1.ApiResult)({ type: [rol_entity_1.Role], isPage: true }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rol_dto_1.RolQueryDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener rol por su ID' }),
    (0, api_result_decorator_1.ApiResult)({ type: rol_entity_1.Role }),
    __param(0, (0, id_param_decorator_1.IdParam)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findOneById", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear rol' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rol_dto_1.RolDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar rol' }),
    __param(0, (0, id_param_decorator_1.IdParam)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, rol_dto_1.RolUpdateDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "update", null);
exports.RolesController = RolesController = __decorate([
    (0, swagger_1.ApiTags)('Sistema - Roles'),
    (0, common_1.Controller)('roles'),
    __metadata("design:paramtypes", [roles_service_1.RolesService])
], RolesController);
//# sourceMappingURL=roles.controller.js.map