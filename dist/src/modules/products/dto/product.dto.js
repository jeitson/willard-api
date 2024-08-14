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
exports.ProductQueryDto = exports.ProductUpdateDto = exports.ProductCreateDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const pager_dto_1 = require("../../../core/common/dto/pager.dto");
class ProductCreateDto {
}
exports.ProductCreateDto = ProductCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del tipo de producto, debe ser un número.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'TipoProductoId es obligatorio y debe ser un número.' }),
    (0, class_validator_1.IsNumber)({}, { message: 'TipoProductoId debe ser un número.' }),
    __metadata("design:type", Number)
], ProductCreateDto.prototype, "productTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la unidad de medida, debe ser un número.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'UnidadMedidaId es obligatorio y debe ser un número.' }),
    (0, class_validator_1.IsNumber)({}, { message: 'UnidadMedidaId debe ser un número.' }),
    __metadata("design:type", Number)
], ProductCreateDto.prototype, "unitMeasureId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del producto, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nombre es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'Nombre debe ser un texto.' }),
    __metadata("design:type", String)
], ProductCreateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Kg promedio del producto, debe ser un número entero.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'KgPromedio es obligatorio y debe ser un número entero.' }),
    (0, class_validator_1.IsInt)({ message: 'KgPromedio debe ser un número entero.' }),
    __metadata("design:type", Number)
], ProductCreateDto.prototype, "averageKg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Porcentaje de recuperación del producto, debe ser un decimal.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'PorcentajeRecuperacion es obligatorio y debe ser un decimal.' }),
    (0, class_validator_1.IsDecimal)({}, { message: 'PorcentajeRecuperacion debe ser un decimal.' }),
    __metadata("design:type", String)
], ProductCreateDto.prototype, "recoveryPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indicador de si el producto es certificable, debe ser booleano.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'EsCertificable es obligatorio y debe ser booleano.' }),
    (0, class_validator_1.IsBoolean)({ message: 'EsCertificable debe ser booleano.' }),
    __metadata("design:type", Boolean)
], ProductCreateDto.prototype, "isCertifiable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Referencia1 del producto, opcional, debe ser un texto.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Referencia1 debe ser un texto.' }),
    __metadata("design:type", String)
], ProductCreateDto.prototype, "reference1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Referencia2 del producto, opcional, debe ser un texto.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Referencia2 debe ser un texto.' }),
    __metadata("design:type", String)
], ProductCreateDto.prototype, "reference2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Referencia3 del producto, opcional, debe ser un texto.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Referencia3 debe ser un texto.' }),
    __metadata("design:type", String)
], ProductCreateDto.prototype, "reference3", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción del producto, opcional, debe ser un texto.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Descripcion debe ser un texto.' }),
    __metadata("design:type", String)
], ProductCreateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Referencia WLL del producto, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ReferenciaWLL es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'ReferenciaWLL debe ser un texto.' }),
    __metadata("design:type", String)
], ProductCreateDto.prototype, "referenceWLL", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Referencia PH del producto, debe ser un texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ReferenciaPH es obligatorio y debe ser un texto.' }),
    (0, class_validator_1.IsString)({ message: 'ReferenciaPH debe ser un texto.' }),
    __metadata("design:type", String)
], ProductCreateDto.prototype, "referencePH", void 0);
class ProductUpdateDto extends (0, swagger_1.PartialType)(ProductCreateDto) {
}
exports.ProductUpdateDto = ProductUpdateDto;
class ProductQueryDto extends (0, swagger_1.IntersectionType)((pager_dto_1.PagerDto), (0, swagger_1.PartialType)((0, swagger_1.PickType)(ProductCreateDto, ['name', 'productTypeId']))) {
}
exports.ProductQueryDto = ProductQueryDto;
//# sourceMappingURL=product.dto.js.map