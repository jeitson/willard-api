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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const rol_entity_1 = require("./entities/rol.entity");
const typeorm_2 = require("typeorm");
const paginate_1 = require("../../core/helper/paginate");
const class_validator_1 = require("class-validator");
const biz_exception_1 = require("../../core/common/exceptions/biz.exception");
const error_code_constant_1 = require("../../core/constants/error-code.constant");
let RolesService = class RolesService {
    constructor(rolesRepository, entityManager) {
        this.rolesRepository = rolesRepository;
        this.entityManager = entityManager;
    }
    async findAll({ page, pageSize, name }) {
        const queryBuilder = this.rolesRepository
            .createQueryBuilder('rol')
            .where({
            ...(name ? { name: (0, typeorm_2.Like)(`%${name}%`) } : null),
        });
        return (0, paginate_1.paginate)(queryBuilder, {
            page,
            pageSize,
        });
    }
    async findOneById(id) {
        return this.rolesRepository.findOneBy({
            id
        });
    }
    async create({ name, description }) {
        const exists = await this.rolesRepository.findOneBy({ name });
        if (!(0, class_validator_1.isEmpty)(exists))
            throw new biz_exception_1.BusinessException(error_code_constant_1.ErrorEnum.SYSTEM_ROLE_EXISTS);
        await this.entityManager.transaction(async (manager) => {
            const r = manager.create(rol_entity_1.Role, {
                name,
                description
            });
            await manager.save(r);
        });
    }
    async update(id, data) {
        await this.entityManager.transaction(async (manager) => {
            await manager.update(rol_entity_1.Role, id, data);
        });
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rol_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectEntityManager)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.EntityManager])
], RolesService);
//# sourceMappingURL=roles.service.js.map