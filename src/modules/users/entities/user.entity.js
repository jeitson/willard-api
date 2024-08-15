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
exports.User = void 0;
const common_entity_1 = require("../../../core/common/entity/common.entity");
const typeorm_1 = require("typeorm");
const user_rol_entity_1 = require("./user-rol.entity");
const swagger_1 = require("@nestjs/swagger");
let User = class User extends common_entity_1.CompleteEntity {
};
exports.User = User;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'oauthId' }),
    (0, typeorm_1.Column)({ unique: true, type: 'bigint', default: null, nullable: true, name: 'OauthId' }),
    __metadata("design:type", String)
], User.prototype, "oauthId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'name' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'Nombre' }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'description' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Descripcion' }),
    __metadata("design:type", String)
], User.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'email' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'Email' }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'roles' }),
    (0, typeorm_1.OneToMany)(() => user_rol_entity_1.UserRole, userRole => userRole.user),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)({ name: 'usuario' })
], User);
//# sourceMappingURL=user.entity.js.map