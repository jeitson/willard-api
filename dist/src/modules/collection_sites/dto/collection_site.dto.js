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
exports.CollectionSiteQueryDto = exports.CollectionSiteUpdateDto = exports.CollectionSiteCreateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const pager_dto_1 = require("../../../core/common/dto/pager.dto");
class CollectionSiteCreateDto {
}
exports.CollectionSiteCreateDto = CollectionSiteCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del tipo de sede, debe ser un número.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'TipoSedeId es obligatorio y debe ser un número.' }),
    (0, class_validator_1.IsNumber)({}, { message: 'TipoSedeId debe ser un número.' }),
    __metadata("design:type", Number)
], CollectionSiteCreateDto.prototype, "siteTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del país, debe ser un número.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'PaisId es obligatorio y debe ser un número.' }),
    (0, class_validator_1.IsNumber)({}, { message: 'PaisId debe ser un número.' }),
    __metadata("design:type", Number)
], CollectionSiteCreateDto.prototype, "countryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la ciudad, debe ser un número.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'CiudadId es obligatorio y debe ser un número.' }),
    (0, class_validator_1.IsNumber)({}, { message: 'CiudadId debe ser un número.' }),
    __metadata("design:type", Number)
], CollectionSiteCreateDto.prototype, "cityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre de la sede, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nombre es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'Nombre debe ser un texto.' }),
    __metadata("design:type", String)
], CollectionSiteCreateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción de la sede, opcional, debe ser un texto.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Descripcion debe ser un texto.' }),
    __metadata("design:type", String)
], CollectionSiteCreateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'NIT de la sede, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nit es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'Nit debe ser un texto.' }),
    __metadata("design:type", String)
], CollectionSiteCreateDto.prototype, "taxId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Razón social de la sede, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'RazonSocial es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'RazonSocial debe ser un texto.' }),
    __metadata("design:type", String)
], CollectionSiteCreateDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Barrio de la sede, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Barrio es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'Barrio debe ser un texto.' }),
    __metadata("design:type", String)
], CollectionSiteCreateDto.prototype, "neighborhood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dirección de la sede, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Direccion es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'Direccion debe ser un texto.' }),
    __metadata("design:type", String)
], CollectionSiteCreateDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Latitud de la sede, opcional, debe ser un texto.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Latitud debe ser un texto.' }),
    __metadata("design:type", String)
], CollectionSiteCreateDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Longitud de la sede, opcional, debe ser un texto.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Longitud debe ser un texto.' }),
    __metadata("design:type", String)
], CollectionSiteCreateDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del contacto, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'NombreContacto es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'NombreContacto debe ser un texto.' }),
    __metadata("design:type", String)
], CollectionSiteCreateDto.prototype, "contactName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email del contacto, debe ser un email válido.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'EmailContacto es obligatorio y debe ser un email válido.' }),
    (0, class_validator_1.IsEmail)({}, { message: 'EmailContacto debe ser un email válido.' }),
    __metadata("design:type", String)
], CollectionSiteCreateDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Celular del contacto, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'CelContacto es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'CelContacto debe ser un texto.' }),
    __metadata("design:type", String)
], CollectionSiteCreateDto.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Referencia WLL de la sede, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ReferenciaWLL es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'ReferenciaWLL debe ser un texto.' }),
    __metadata("design:type", String)
], CollectionSiteCreateDto.prototype, "referenceWLL", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Referencia PH de la sede, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ReferenciaPH es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'ReferenciaPH debe ser un texto.' }),
    __metadata("design:type", String)
], CollectionSiteCreateDto.prototype, "referencePH", void 0);
class CollectionSiteUpdateDto extends (0, swagger_1.PartialType)(CollectionSiteCreateDto) {
}
exports.CollectionSiteUpdateDto = CollectionSiteUpdateDto;
class CollectionSiteQueryDto extends (0, swagger_1.IntersectionType)((pager_dto_1.PagerDto), (0, swagger_1.PartialType)((0, swagger_1.PickType)(CollectionSiteCreateDto, ['siteTypeId', 'countryId', 'cityId', 'name', 'taxId']))) {
}
exports.CollectionSiteQueryDto = CollectionSiteQueryDto;
//# sourceMappingURL=collection_site.dto.js.map