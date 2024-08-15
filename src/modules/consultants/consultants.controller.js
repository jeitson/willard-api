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
exports.ConsultantsController = void 0;
const common_1 = require("@nestjs/common");
const consultants_service_1 = require("./consultants.service");
const swagger_1 = require("@nestjs/swagger");
const api_result_decorator_1 = require("../../core/common/decorators/api-result.decorator");
const consultant_entity_1 = require("./entities/consultant.entity");
const consultant_dto_1 = require("./dto/consultant.dto");
let ConsultantsController = class ConsultantsController {
    constructor(consultantsService) {
        this.consultantsService = consultantsService;
    }
    create(createConsultantDto) {
        return this.consultantsService.create(createConsultantDto);
    }
    async findAll(dto) {
        return this.consultantsService.findAll(dto);
    }
    findOne(id) {
        return this.consultantsService.findOne(+id);
    }
    update(id, updateConsultantDto) {
        return this.consultantsService.update(+id, updateConsultantDto);
    }
    changeStatus(id, status) {
        return this.consultantsService.changeStatus(+id, status);
    }
    remove(id) {
        return this.consultantsService.remove(+id);
    }
};
exports.ConsultantsController = ConsultantsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Creación de asesores' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [consultant_dto_1.ConsultantCreateDto]),
    __metadata("design:returntype", Promise)
], ConsultantsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener listado de asesores - Paginación' }),
    (0, api_result_decorator_1.ApiResult)({ type: [consultant_entity_1.Consultant], isPage: true }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [consultant_dto_1.ConsultantQueryDto]),
    __metadata("design:returntype", Promise)
], ConsultantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener asesor por su ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsultantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar asesor' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, consultant_dto_1.ConsultantUpdateDto]),
    __metadata("design:returntype", Promise)
], ConsultantsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/change-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Cambiar de estado asesor' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], ConsultantsController.prototype, "changeStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar asesor' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsultantsController.prototype, "remove", null);
exports.ConsultantsController = ConsultantsController = __decorate([
    (0, swagger_1.ApiTags)('Negocio - Asesores'),
    (0, common_1.Controller)('consultants'),
    __metadata("design:paramtypes", [consultants_service_1.ConsultantsService])
], ConsultantsController);
//# sourceMappingURL=consultants.controller.js.map