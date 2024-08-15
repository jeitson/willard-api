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
exports.ChildSearchDto = exports.ChildQueryDto = exports.ChildUpdateDto = exports.ChildDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const pager_dto_1 = require("../../../core/common/dto/pager.dto");
class ChildDto {
    constructor() {
        this.description = '';
        this.order = null;
        this.extra1 = '';
        this.extra2 = '';
        this.extra3 = '';
        this.extra4 = '';
        this.extra5 = '';
    }
}
exports.ChildDto = ChildDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Codigo del Padre' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'El tamaño máximo de caracteres es de 50' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El campo no debe de estar vacío' }),
    __metadata("design:type", String)
], ChildDto.prototype, "catalogCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del padre' }),
    __metadata("design:type", Number)
], ChildDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre', example: 'Administrador' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'El tamaño máximo de caracteres es de 50' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El campo no debe de estar vacío' }),
    __metadata("design:type", String)
], ChildDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción', example: 'Descripicón del hijo' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255, { message: 'El tamaño máximo de caracteres es de 255' }),
    __metadata("design:type", String)
], ChildDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Orden', example: 'Orden de los items' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ChildDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Extra 1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255, { message: 'El tamaño máximo de caracteres es de 255' }),
    __metadata("design:type", String)
], ChildDto.prototype, "extra1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Extra 2' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255, { message: 'El tamaño máximo de caracteres es de 255' }),
    __metadata("design:type", String)
], ChildDto.prototype, "extra2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Extra 3' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255, { message: 'El tamaño máximo de caracteres es de 255' }),
    __metadata("design:type", String)
], ChildDto.prototype, "extra3", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Extra 4' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255, { message: 'El tamaño máximo de caracteres es de 255' }),
    __metadata("design:type", String)
], ChildDto.prototype, "extra4", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Extra 5' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255, { message: 'El tamaño máximo de caracteres es de 255' }),
    __metadata("design:type", String)
], ChildDto.prototype, "extra5", void 0);
class ChildUpdateDto extends (0, swagger_1.PartialType)(ChildDto) {
}
exports.ChildUpdateDto = ChildUpdateDto;
class ChildQueryDto extends (0, swagger_1.IntersectionType)((pager_dto_1.PagerDto), (0, swagger_1.PartialType)((0, swagger_1.OmitType)(ChildDto, ['extra1', 'extra2', 'extra3', 'extra4', 'extra5', 'description', 'order']))) {
}
exports.ChildQueryDto = ChildQueryDto;
class ChildSearchDto {
    constructor() {
        this.keys = [''];
    }
}
exports.ChildSearchDto = ChildSearchDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ChildSearchDto.prototype, "keys", void 0);
//# sourceMappingURL=child.dto.js.map