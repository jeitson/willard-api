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
exports.UserQueryDto = exports.UserUpdateDto = exports.UserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const lodash_1 = require("lodash");
const pager_dto_1 = require("../../../core/common/dto/pager.dto");
class UserDto {
    constructor() {
        this.description = '';
        this.roles = [];
    }
}
exports.UserDto = UserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'OauthId', example: '123...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", String)
], UserDto.prototype, "oauthId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre', example: 'Jon Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'El tamaño máximo de caracteres es de 50' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El campo no debe de estar vacío' }),
    __metadata("design:type", String)
], UserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción', example: 'Jon Doe, usuario de prueba' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255, { message: 'El tamaño máximo de caracteres es de 255' }),
    __metadata("design:type", String)
], UserDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email', example: 'bqy.dev@qq.com' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.ValidateIf)((o) => !(0, lodash_1.isEmpty)(o.email)),
    __metadata("design:type", String)
], UserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Roles', type: [Number] }),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UserDto.prototype, "roles", void 0);
class UserUpdateDto extends (0, swagger_1.PartialType)(UserDto) {
}
exports.UserUpdateDto = UserUpdateDto;
class UserQueryDto extends (0, swagger_1.IntersectionType)((pager_dto_1.PagerDto), (0, swagger_1.PartialType)((0, swagger_1.OmitType)(UserDto, ['description', 'oauthId']), { skipNullProperties: false })) {
}
exports.UserQueryDto = UserQueryDto;
//# sourceMappingURL=user.dto.js.map