"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportersModule = void 0;
const common_1 = require("@nestjs/common");
const transporters_service_1 = require("./transporters.service");
const transporters_controller_1 = require("./transporters.controller");
const typeorm_1 = require("@nestjs/typeorm");
const transporter_entity_1 = require("./entities/transporter.entity");
const providers = [transporters_service_1.TransportersService];
let TransportersModule = class TransportersModule {
};
exports.TransportersModule = TransportersModule;
exports.TransportersModule = TransportersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([transporter_entity_1.Transporter])],
        controllers: [transporters_controller_1.TransportersController],
        providers,
        exports: [typeorm_1.TypeOrmModule, ...providers],
    })
], TransportersModule);
//# sourceMappingURL=transporters.module.js.map