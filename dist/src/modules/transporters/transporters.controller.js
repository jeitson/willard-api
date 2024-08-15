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
exports.TransportersController = void 0;
const common_1 = require("@nestjs/common");
const transporters_service_1 = require("./transporters.service");
const swagger_1 = require("@nestjs/swagger");
const api_result_decorator_1 = require("../../core/common/decorators/api-result.decorator");
const transporter_dto_1 = require("./dto/transporter.dto");
const transporter_entity_1 = require("./entities/transporter.entity");
let TransportersController = class TransportersController {
    constructor(transportersService) {
        this.transportersService = transportersService;
    }
    create(createTransporterDto) {
        return this.transportersService.create(createTransporterDto);
    }
    async findAll(dto) {
        return this.transportersService.findAll(dto);
    }
    findOne(id) {
        return this.transportersService.findOne(+id);
    }
    update(id, updateTransporterDto) {
        return this.transportersService.update(+id, updateTransporterDto);
    }
    changeStatus(id, status) {
        return this.transportersService.changeStatus(+id, status);
    }
    remove(id) {
        return this.transportersService.remove(+id);
    }
};
exports.TransportersController = TransportersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Creación de transportador' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transporter_dto_1.TransporterCreateDto]),
    __metadata("design:returntype", Promise)
], TransportersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener listado de transportadores - Paginación' }),
    (0, api_result_decorator_1.ApiResult)({ type: [transporter_entity_1.Transporter], isPage: true }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transporter_dto_1.TransporterQueryDto]),
    __metadata("design:returntype", Promise)
], TransportersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener transportador por su ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransportersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar transportador' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, transporter_dto_1.TransporterUpdateDto]),
    __metadata("design:returntype", Promise)
], TransportersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/change-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Cambiar de estado transportador' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], TransportersController.prototype, "changeStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar transportador' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransportersController.prototype, "remove", null);
exports.TransportersController = TransportersController = __decorate([
    (0, swagger_1.ApiTags)('Negocio - Transportadores'),
    (0, common_1.Controller)('transporters'),
    __metadata("design:paramtypes", [transporters_service_1.TransportersService])
], TransportersController);
//# sourceMappingURL=transporters.controller.js.map