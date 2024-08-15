"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultantsModule = void 0;
const common_1 = require("@nestjs/common");
const consultants_service_1 = require("./consultants.service");
const consultants_controller_1 = require("./consultants.controller");
const typeorm_1 = require("@nestjs/typeorm");
const consultant_entity_1 = require("./entities/consultant.entity");
const providers = [consultants_service_1.ConsultantsService];
let ConsultantsModule = class ConsultantsModule {
};
exports.ConsultantsModule = ConsultantsModule;
exports.ConsultantsModule = ConsultantsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([consultant_entity_1.Consultant])],
        controllers: [consultants_controller_1.ConsultantsController],
        providers,
        exports: [typeorm_1.TypeOrmModule, ...providers],
    })
], ConsultantsModule);
//# sourceMappingURL=consultants.module.js.map