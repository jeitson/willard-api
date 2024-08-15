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
exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const rol_entity_1 = require("../../roles/entities/rol.entity");
let UserRole = class UserRole {
};
exports.UserRole = UserRole;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'bigint', name: 'UsuarioId' }),
    __metadata("design:type", String)
], UserRole.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'bigint', name: 'RolId' }),
    __metadata("design:type", String)
], UserRole.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.roles),
    (0, typeorm_1.JoinColumn)({ name: 'UsuarioId' }),
    __metadata("design:type", user_entity_1.User)
], UserRole.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => rol_entity_1.Role, role => role.users),
    (0, typeorm_1.JoinColumn)({ name: 'RolId' }),
    __metadata("design:type", rol_entity_1.Role)
], UserRole.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({ update: false, comment: 'Creador', type: 'bigint', nullable: true, name: 'CreadoPor' }),
    __metadata("design:type", String)
], UserRole.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({ comment: 'Actualizador', type: 'bigint', nullable: true, name: 'ModificadoPor' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserRole.prototype, "updatedBy", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, typeorm_1.CreateDateColumn)({
        nullable: true,
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        name: 'FechaCreacion'
    }),
    __metadata("design:type", Date)
], UserRole.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, typeorm_1.UpdateDateColumn)({
        nullable: true,
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
        name: 'FechaModificado'
    }),
    __metadata("design:type", Date)
], UserRole.prototype, "updatedAt", void 0);
exports.UserRole = UserRole = __decorate([
    (0, typeorm_1.Entity)('usuario_rol')
], UserRole);
//# sourceMappingURL=user-rol.entity.js.map