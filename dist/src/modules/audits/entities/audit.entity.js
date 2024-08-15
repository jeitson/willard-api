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
exports.Audit = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_entity_1 = require("../../../core/common/entity/common.entity");
const typeorm_1 = require("typeorm");
let Audit = class Audit extends common_entity_1.CompleteEntity {
};
exports.Audit = Audit;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'userId' }),
    (0, typeorm_1.Column)({ type: 'bigint', name: 'UsuarioId' }),
    __metadata("design:type", String)
], Audit.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'name' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'Nombre' }),
    __metadata("design:type", String)
], Audit.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'description' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Descripcion' }),
    __metadata("design:type", String)
], Audit.prototype, "description", void 0);
exports.Audit = Audit = __decorate([
    (0, typeorm_1.Entity)({ name: 'auditoria' })
], Audit);
//# sourceMappingURL=audit.entity.js.map