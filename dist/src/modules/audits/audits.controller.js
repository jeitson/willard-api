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
exports.AuditsController = void 0;
const common_1 = require("@nestjs/common");
const audits_service_1 = require("./audits.service");
const swagger_1 = require("@nestjs/swagger");
const api_result_decorator_1 = require("../../core/common/decorators/api-result.decorator");
const id_param_decorator_1 = require("../../core/common/decorators/id-param.decorator");
const audit_entity_1 = require("./entities/audit.entity");
const audit_dto_1 = require("./dto/audit.dto");
let AuditsController = class AuditsController {
    constructor(auditsService) {
        this.auditsService = auditsService;
    }
    async findAll(dto) {
        return this.auditsService.findAll(dto);
    }
    async findOneById(id) {
        return this.auditsService.findOneById(+id);
    }
};
exports.AuditsController = AuditsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener listado de auditorias - Paginación' }),
    (0, api_result_decorator_1.ApiResult)({ type: [audit_entity_1.Audit], isPage: true }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [audit_dto_1.AuditQueryDto]),
    __metadata("design:returntype", Promise)
], AuditsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener auditoria por su ID' }),
    __param(0, (0, id_param_decorator_1.IdParam)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuditsController.prototype, "findOneById", null);
exports.AuditsController = AuditsController = __decorate([
    (0, swagger_1.ApiTags)('Sistema - Auditorias'),
    (0, common_1.Controller)('audits'),
    __metadata("design:paramtypes", [audits_service_1.AuditsService])
], AuditsController);
//# sourceMappingURL=audits.controller.js.map