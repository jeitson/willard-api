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
exports.CompleteEntity = exports.CommonEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
class CommonEntity extends typeorm_1.BaseEntity {
}
exports.CommonEntity = CommonEntity;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', name: 'Id' }),
    __metadata("design:type", Number)
], CommonEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    (0, typeorm_1.CreateDateColumn)({
        nullable: true,
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        name: 'FechaCreacion',
    }),
    __metadata("design:type", Date)
], CommonEntity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    (0, typeorm_1.UpdateDateColumn)({
        nullable: true,
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
        name: 'FechaModificado',
    }),
    __metadata("design:type", Date)
], CommonEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estado' }),
    (0, class_transformer_1.Expose)(),
    (0, typeorm_1.Column)({ comment: 'Estado', default: true, name: 'Estado' }),
    __metadata("design:type", Boolean)
], CommonEntity.prototype, "status", void 0);
class CompleteEntity extends CommonEntity {
}
exports.CompleteEntity = CompleteEntity;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({ update: false, comment: 'Creador', type: 'bigint', nullable: true, name: 'CreadoPor' }),
    __metadata("design:type", String)
], CompleteEntity.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({ comment: 'Actualizador', type: 'bigint', nullable: true, name: 'ModificadoPor' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CompleteEntity.prototype, "modifiedBy", void 0);
//# sourceMappingURL=common.entity.js.map