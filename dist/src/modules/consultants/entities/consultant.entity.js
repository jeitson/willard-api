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
exports.Consultant = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_entity_1 = require("../../../core/common/entity/common.entity");
const typeorm_1 = require("typeorm");
let Consultant = class Consultant extends common_entity_1.CompleteEntity {
};
exports.Consultant = Consultant;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'name' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'Nombre' }),
    __metadata("design:type", String)
], Consultant.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'email' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'Email' }),
    __metadata("design:type", String)
], Consultant.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'phone' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'Cel' }),
    __metadata("design:type", String)
], Consultant.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'description' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Descripcion' }),
    __metadata("design:type", String)
], Consultant.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'referencePH' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'ReferenciaPH' }),
    __metadata("design:type", String)
], Consultant.prototype, "referencePH", void 0);
exports.Consultant = Consultant = __decorate([
    (0, typeorm_1.Entity)({ name: 'asesor' })
], Consultant);
//# sourceMappingURL=consultant.entity.js.map