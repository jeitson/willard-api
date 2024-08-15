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
exports.Child = void 0;
const common_entity_1 = require("../../../core/common/entity/common.entity");
const typeorm_1 = require("typeorm");
const parent_entity_1 = require("./parent.entity");
const swagger_1 = require("@nestjs/swagger");
let Child = class Child extends common_entity_1.CompleteEntity {
};
exports.Child = Child;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'parentId' }),
    (0, typeorm_1.Column)({ type: 'bigint', name: 'PadreId' }),
    __metadata("design:type", Number)
], Child.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'catalogCode' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'CodigoCatalogo' }),
    __metadata("design:type", String)
], Child.prototype, "catalogCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'name' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'Nombre' }),
    __metadata("design:type", String)
], Child.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'description' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Descripcion' }),
    __metadata("design:type", String)
], Child.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'order' }),
    (0, typeorm_1.Column)({ type: 'int', default: null, nullable: true, name: 'Orden' }),
    __metadata("design:type", Number)
], Child.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'extra1' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Extra1' }),
    __metadata("design:type", String)
], Child.prototype, "extra1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'extra2' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Extra2' }),
    __metadata("design:type", String)
], Child.prototype, "extra2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'extra3' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Extra3' }),
    __metadata("design:type", String)
], Child.prototype, "extra3", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'extra4' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Extra4' }),
    __metadata("design:type", String)
], Child.prototype, "extra4", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'extra5' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Extra5' }),
    __metadata("design:type", String)
], Child.prototype, "extra5", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'parent' }),
    (0, typeorm_1.ManyToOne)(() => parent_entity_1.Parent, (parent) => parent.children),
    __metadata("design:type", parent_entity_1.Parent)
], Child.prototype, "parent", void 0);
exports.Child = Child = __decorate([
    (0, typeorm_1.Entity)({ name: 'catalogo_hijo' })
], Child);
//# sourceMappingURL=child.entity.js.map