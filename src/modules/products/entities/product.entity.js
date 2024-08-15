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
exports.Product = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_entity_1 = require("../../../core/common/entity/common.entity");
const typeorm_1 = require("typeorm");
let Product = class Product extends common_entity_1.CompleteEntity {
};
exports.Product = Product;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'productTypeId' }),
    (0, typeorm_1.Column)({ type: 'bigint', name: 'TipoProductoId' }),
    __metadata("design:type", Number)
], Product.prototype, "productTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'unitMeasureId' }),
    (0, typeorm_1.Column)({ type: 'bigint', name: 'UnidadMedidaId' }),
    __metadata("design:type", Number)
], Product.prototype, "unitMeasureId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'name' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'Nombre' }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'averageKg' }),
    (0, typeorm_1.Column)({ type: 'bigint', name: 'KgPromedio' }),
    __metadata("design:type", Number)
], Product.prototype, "averageKg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'recoveryPercentage' }),
    (0, typeorm_1.Column)({ type: 'numeric', precision: 8, scale: 2, default: 0, name: 'PorcentajeRecuperacion' }),
    __metadata("design:type", String)
], Product.prototype, "recoveryPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'isCertifiable' }),
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'EsCertificable' }),
    __metadata("design:type", Boolean)
], Product.prototype, "isCertifiable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'reference1' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Referencia1' }),
    __metadata("design:type", String)
], Product.prototype, "reference1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'reference2' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Referencia2' }),
    __metadata("design:type", String)
], Product.prototype, "reference2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'reference3' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Referencia3' }),
    __metadata("design:type", String)
], Product.prototype, "reference3", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'description' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Descripcion' }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'referenceWLL' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'ReferenciaWLL' }),
    __metadata("design:type", String)
], Product.prototype, "referenceWLL", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'referencePH' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'ReferenciaPH' }),
    __metadata("design:type", String)
], Product.prototype, "referencePH", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)({ name: 'producto' })
], Product);
//# sourceMappingURL=product.entity.js.map