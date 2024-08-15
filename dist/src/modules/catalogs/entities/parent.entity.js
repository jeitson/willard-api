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
exports.Parent = void 0;
const common_entity_1 = require("../../../core/common/entity/common.entity");
const typeorm_1 = require("typeorm");
const child_entity_1 = require("./child.entity");
const swagger_1 = require("@nestjs/swagger");
let Parent = class Parent extends common_entity_1.CompleteEntity {
};
exports.Parent = Parent;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'code' }),
    (0, typeorm_1.Column)({ unique: true, type: 'varchar', length: 50, name: 'Codigo' }),
    __metadata("design:type", String)
], Parent.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'name' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'Nombre' }),
    __metadata("design:type", String)
], Parent.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'description' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Descripcion' }),
    __metadata("design:type", String)
], Parent.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'children' }),
    (0, typeorm_1.OneToMany)(() => child_entity_1.Child, (child) => child.parent),
    __metadata("design:type", Array)
], Parent.prototype, "children", void 0);
exports.Parent = Parent = __decorate([
    (0, typeorm_1.Entity)({ name: 'catalogo_padre' })
], Parent);
//# sourceMappingURL=parent.entity.js.map