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
exports.CollectionSite = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_entity_1 = require("../../../core/common/entity/common.entity");
const typeorm_1 = require("typeorm");
let CollectionSite = class CollectionSite extends common_entity_1.CompleteEntity {
};
exports.CollectionSite = CollectionSite;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'siteTypeId' }),
    (0, typeorm_1.Column)({ type: 'bigint', name: 'TipoSedeId' }),
    __metadata("design:type", Number)
], CollectionSite.prototype, "siteTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'countryId' }),
    (0, typeorm_1.Column)({ type: 'bigint', name: 'PaisId' }),
    __metadata("design:type", Number)
], CollectionSite.prototype, "countryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'cityId' }),
    (0, typeorm_1.Column)({ type: 'bigint', name: 'CiudadId' }),
    __metadata("design:type", Number)
], CollectionSite.prototype, "cityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'name' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'Nombre' }),
    __metadata("design:type", String)
], CollectionSite.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'description' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Descripcion' }),
    __metadata("design:type", String)
], CollectionSite.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'taxId' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, name: 'Nit' }),
    __metadata("design:type", String)
], CollectionSite.prototype, "taxId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'businessName' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'RazonSocial' }),
    __metadata("design:type", String)
], CollectionSite.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'neighborhood' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'Barrio' }),
    __metadata("design:type", String)
], CollectionSite.prototype, "neighborhood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'address' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'Direccion' }),
    __metadata("design:type", String)
], CollectionSite.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'latitude' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, default: null, name: 'Latitud' }),
    __metadata("design:type", String)
], CollectionSite.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'longitude' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, default: null, name: 'Longitud' }),
    __metadata("design:type", String)
], CollectionSite.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'contactName' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'NombreContacto' }),
    __metadata("design:type", String)
], CollectionSite.prototype, "contactName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'contactEmail' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'EmailContacto' }),
    __metadata("design:type", String)
], CollectionSite.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'contactPhone' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'CelContacto' }),
    __metadata("design:type", String)
], CollectionSite.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'referenceWLL' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'ReferenciaWLL' }),
    __metadata("design:type", String)
], CollectionSite.prototype, "referenceWLL", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'referencePH' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'ReferenciaPH' }),
    __metadata("design:type", String)
], CollectionSite.prototype, "referencePH", void 0);
exports.CollectionSite = CollectionSite = __decorate([
    (0, typeorm_1.Entity)({ name: 'sedes_acopio' })
], CollectionSite);
//# sourceMappingURL=collection_site.entity.js.map