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
exports.ClientQueryDto = exports.ClientUpdateDto = exports.ClientCreateDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const pager_dto_1 = require("../../../core/common/dto/pager.dto");
class ClientCreateDto {
}
exports.ClientCreateDto = ClientCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del cliente, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nombre es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'Nombre debe ser un texto.' }),
    __metadata("design:type", String)
], ClientCreateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción del cliente, opcional, debe ser un texto.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Descripcion debe ser un texto.' }),
    __metadata("design:type", String)
], ClientCreateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Razón social del cliente, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'RazonSocial es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'RazonSocial debe ser un texto.' }),
    __metadata("design:type", String)
], ClientCreateDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del tipo de documento, debe ser un número.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'TipoDocumentoId es obligatorio y debe ser un número.' }),
    (0, class_validator_1.IsNumber)({}, { message: 'TipoDocumentoId debe ser un número.' }),
    __metadata("design:type", Number)
], ClientCreateDto.prototype, "documentTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del país, debe ser un número.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'PaisId es obligatorio y debe ser un número.' }),
    (0, class_validator_1.IsNumber)({}, { message: 'PaisId debe ser un número.' }),
    __metadata("design:type", Number)
], ClientCreateDto.prototype, "countryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Número del documento, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'NumeroDocumento es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'NumeroDocumento debe ser un texto.' }),
    __metadata("design:type", String)
], ClientCreateDto.prototype, "documentNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Referencia WLL del cliente, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ReferenciaWLL es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'ReferenciaWLL debe ser un texto.' }),
    __metadata("design:type", String)
], ClientCreateDto.prototype, "referenceWLL", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Referencia PH del cliente, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ReferenciaPH es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'ReferenciaPH debe ser un texto.' }),
    __metadata("design:type", String)
], ClientCreateDto.prototype, "referencePH", void 0);
class ClientUpdateDto extends (0, swagger_1.PartialType)(ClientCreateDto) {
}
exports.ClientUpdateDto = ClientUpdateDto;
class ClientQueryDto extends (0, swagger_1.IntersectionType)((pager_dto_1.PagerDto), (0, swagger_1.PartialType)((0, swagger_1.PickType)(ClientCreateDto, ['name', 'countryId', 'documentNumber', 'businessName']))) {
}
exports.ClientQueryDto = ClientQueryDto;
//# sourceMappingURL=client.dto.js.map