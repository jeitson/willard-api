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
exports.Client = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_entity_1 = require("../../../core/common/entity/common.entity");
const typeorm_1 = require("typeorm");
let Client = class Client extends common_entity_1.CompleteEntity {
};
exports.Client = Client;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'name' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'Nombre' }),
    __metadata("design:type", String)
], Client.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'description' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Descripcion' }),
    __metadata("design:type", String)
], Client.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'businessName' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'RazonSocial' }),
    __metadata("design:type", String)
], Client.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'documentTypeId' }),
    (0, typeorm_1.Column)({ type: 'bigint', name: 'TipoDocumentoId' }),
    __metadata("design:type", Number)
], Client.prototype, "documentTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'countryId' }),
    (0, typeorm_1.Column)({ type: 'bigint', name: 'PaisId' }),
    __metadata("design:type", Number)
], Client.prototype, "countryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'documentNumber' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'NumeroDocumento' }),
    __metadata("design:type", String)
], Client.prototype, "documentNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'referenceWLL' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'ReferenciaWLL' }),
    __metadata("design:type", String)
], Client.prototype, "referenceWLL", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'referencePH' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'ReferenciaPH' }),
    __metadata("design:type", String)
], Client.prototype, "referencePH", void 0);
exports.Client = Client = __decorate([
    (0, typeorm_1.Entity)({ name: 'cliente' })
], Client);
//# sourceMappingURL=client.entity.js.map