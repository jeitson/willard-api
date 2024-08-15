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
exports.PagerDto = exports.Order = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var Order;
(function (Order) {
    Order["ASC"] = "ASC";
    Order["DESC"] = "DESC";
})(Order || (exports.Order = Order = {}));
class PagerDto {
}
exports.PagerDto = PagerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ minimum: 1, default: 1 }),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)({ always: true }),
    (0, class_transformer_1.Transform)(({ value: val }) => (val ? Number.parseInt(val) : 1), {
        toClassOnly: true,
    }),
    __metadata("design:type", Number)
], PagerDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ minimum: 1, maximum: 100, default: 10 }),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)({ always: true }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value: val }) => (val ? Number.parseInt(val) : 10), {
        toClassOnly: true,
    }),
    __metadata("design:type", Number)
], PagerDto.prototype, "pageSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Order }),
    (0, class_validator_1.IsEnum)(Order),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === 'asc' ? Order.ASC : Order.DESC)),
    __metadata("design:type", String)
], PagerDto.prototype, "order", void 0);
__decorate([
    (0, class_validator_1.Allow)(),
    __metadata("design:type", Number)
], PagerDto.prototype, "_t", void 0);
//# sourceMappingURL=pager.dto.js.map