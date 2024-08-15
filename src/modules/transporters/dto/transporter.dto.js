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
exports.TransporterQueryDto = exports.TransporterUpdateDto = exports.TransporterCreateDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const pager_dto_1 = require("../../../core/common/dto/pager.dto");
class TransporterCreateDto {
}
exports.TransporterCreateDto = TransporterCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del transportador, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nombre es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'Nombre debe ser un texto.' }),
    __metadata("design:type", String)
], TransporterCreateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'NIT del transportador, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nit es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'Nit debe ser un texto.' }),
    __metadata("design:type", String)
], TransporterCreateDto.prototype, "taxId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Razón Social del transportador, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'RazonSocial es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'RazonSocial debe ser un texto.' }),
    __metadata("design:type", String)
], TransporterCreateDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción del transportador, opcional, debe ser un texto.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Descripcion debe ser un texto.' }),
    __metadata("design:type", String)
], TransporterCreateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del contacto, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'NombreContacto es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'NombreContacto debe ser un texto.' }),
    __metadata("design:type", String)
], TransporterCreateDto.prototype, "contactName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email del contacto, debe ser un email válido.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'EmailContacto es obligatorio y debe ser un email válido.' }),
    (0, class_validator_1.IsEmail)({}, { message: 'EmailContacto debe ser un email válido.' }),
    __metadata("design:type", String)
], TransporterCreateDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Referencia WLL del transportador, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ReferenciaWLL es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'ReferenciaWLL debe ser un texto.' }),
    __metadata("design:type", String)
], TransporterCreateDto.prototype, "referenceWLL", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Referencia PH del transportador, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ReferenciaPH es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'ReferenciaPH debe ser un texto.' }),
    __metadata("design:type", String)
], TransporterCreateDto.prototype, "referencePH", void 0);
class TransporterUpdateDto extends (0, swagger_1.PartialType)(TransporterCreateDto) {
}
exports.TransporterUpdateDto = TransporterUpdateDto;
class TransporterQueryDto extends (0, swagger_1.IntersectionType)((pager_dto_1.PagerDto), (0, swagger_1.PartialType)((0, swagger_1.PickType)(TransporterCreateDto, ['name', 'taxId', 'contactName', 'businessName']))) {
}
exports.TransporterQueryDto = TransporterQueryDto;
//# sourceMappingURL=transporter.dto.js.map