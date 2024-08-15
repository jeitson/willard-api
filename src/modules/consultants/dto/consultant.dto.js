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
exports.ConsultantQueryDto = exports.ConsultantUpdateDto = exports.ConsultantCreateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const pager_dto_1 = require("../../../core/common/dto/pager.dto");
class ConsultantCreateDto {
}
exports.ConsultantCreateDto = ConsultantCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del asesor, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nombre es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'Nombre debe ser un texto.' }),
    __metadata("design:type", String)
], ConsultantCreateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email del asesor, debe ser un email válido.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email es obligatorio y debe ser un email válido.' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email debe ser un email válido.' }),
    __metadata("design:type", String)
], ConsultantCreateDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Celular del asesor, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Cel es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'Cel debe ser un texto.' }),
    __metadata("design:type", String)
], ConsultantCreateDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción del asesor, opcional, debe ser un texto.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Descripcion debe ser un texto.' }),
    __metadata("design:type", String)
], ConsultantCreateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Referencia PH del asesor, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ReferenciaPH es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'ReferenciaPH debe ser un texto.' }),
    __metadata("design:type", String)
], ConsultantCreateDto.prototype, "referencePH", void 0);
class ConsultantUpdateDto extends (0, swagger_1.PartialType)(ConsultantCreateDto) {
}
exports.ConsultantUpdateDto = ConsultantUpdateDto;
class ConsultantQueryDto extends (0, swagger_1.IntersectionType)((pager_dto_1.PagerDto), (0, swagger_1.PartialType)((0, swagger_1.OmitType)(ConsultantCreateDto, ['description', 'referencePH']))) {
}
exports.ConsultantQueryDto = ConsultantQueryDto;
//# sourceMappingURL=consultant.dto.js.map