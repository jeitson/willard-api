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
exports.UUIDParamDto = void 0;
exports.IdParam = IdParam;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
class UUIDParamDto {
}
exports.UUIDParamDto = UUIDParamDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UUIDParamDto.prototype, "id", void 0);
function IdParam(key = 'id') {
    return (0, common_1.Param)(key, new common_1.ParseIntPipe({
        errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE,
        exceptionFactory: () => {
            throw new common_1.NotAcceptableException('ID Formato incorrecto');
        },
    }));
}
//# sourceMappingURL=id-param.decorator.js.map