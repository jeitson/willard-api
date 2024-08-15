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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditQueryDto = exports.AuditDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const pager_dto_1 = require("../../../core/common/dto/pager.dto");
class AuditDto {
    constructor() {
        this.description = '';
    }
}
exports.AuditDto = AuditDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Usuario', example: '1' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El campo no debe de estar vacío' }),
    __metadata("design:type", String)
], AuditDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre', example: 'Auditoría - ACC1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'El tamaño máximo de caracteres es de 50' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El campo no debe de estar vacío' }),
    __metadata("design:type", String)
], AuditDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción', example: 'Descripción de la auditoría' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255, { message: 'El tamaño máximo de caracteres es de 255' }),
    __metadata("design:type", String)
], AuditDto.prototype, "description", void 0);
class AuditQueryDto extends (0, swagger_1.IntersectionType)((pager_dto_1.PagerDto), (0, swagger_1.PartialType)((0, swagger_1.OmitType)(AuditDto, ['description']))) {
}
exports.AuditQueryDto = AuditQueryDto;
//# sourceMappingURL=audit.dto.js.map