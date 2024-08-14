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
exports.CatalogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const parent_entity_1 = require("./entities/parent.entity");
const typeorm_2 = require("typeorm");
const child_entity_1 = require("./entities/child.entity");
const biz_exception_1 = require("../../core/common/exceptions/biz.exception");
let CatalogsService = class CatalogsService {
    constructor(parentsRepository, childrensRepository, entityManager) {
        this.parentsRepository = parentsRepository;
        this.childrensRepository = childrensRepository;
        this.entityManager = entityManager;
    }
    async createChild(createChildDto) {
        const { catalogCode, ...childData } = createChildDto;
        const parent = await this.parentsRepository.findOne({ where: { code: catalogCode } });
        if (!parent) {
            throw new biz_exception_1.BusinessException('Padre no encontrado', 400);
        }
        const parentChild = await this.childrensRepository.findOne({ where: { id: createChildDto.parentId } });
        if (!parentChild) {
            throw new biz_exception_1.BusinessException('Elemento superior de la jerarquía no encontrado', 400);
        }
        const child = this.childrensRepository.create({
            ...childData,
            catalogCode,
            parentId: parentChild.id,
        });
        return await this.childrensRepository.save(child);
    }
    async updateChild(id, updateChildDto) {
        const child = await this.childrensRepository.findOneBy({ id });
        if (!child) {
            throw new biz_exception_1.BusinessException('Hijo no encontrado', 400);
        }
        const { catalogCode, ...updateData } = updateChildDto;
        if (catalogCode) {
            const parent = await this.parentsRepository.findOne({ where: { code: catalogCode } });
            if (parent) {
                updateData.parentId = parent.id;
            }
        }
        Object.assign(child, updateData);
        return await this.childrensRepository.save(child);
    }
    async changeOrder(id, order) {
        const child = await this.childrensRepository.findOneBy({ id });
        if (!child) {
            throw new biz_exception_1.BusinessException('Hijo no encontrado', 400);
        }
        child.order = order;
        return await this.childrensRepository.save(child);
    }
    async changeParent(id, parentId) {
        const child = await this.childrensRepository.findOneBy({ id });
        if (!child) {
            throw new biz_exception_1.BusinessException('Hijo no encontrado', 400);
        }
        const parent = await this.parentsRepository.findOneBy({ id: parentId });
        if (!parent) {
            throw new biz_exception_1.BusinessException('Padre no encontrado', 400);
        }
        child.parentId = parentId;
        child.parent = parent;
        return await this.childrensRepository.save(child);
    }
    async changeStatus(id) {
        const child = await this.childrensRepository.findOneBy({ id });
        if (!child) {
            throw new biz_exception_1.BusinessException('Hijo no encontrado', 400);
        }
        child.status = !child.status;
        return await this.childrensRepository.save(child);
    }
    async deleteChild(id) {
        const result = await this.childrensRepository.delete(id);
        if (result.affected === 0) {
            throw new biz_exception_1.BusinessException('Hijo no encontrado', 400);
        }
    }
    async getChildById(id) {
        const child = await this.childrensRepository.findOneBy({ id });
        if (!child) {
            throw new biz_exception_1.BusinessException('Hijo no encontrado', 400);
        }
        return child;
    }
    async getChildrenByKey(key) {
        return await this.childrensRepository.find({ where: { catalogCode: key } });
    }
    async getChildrenByKeyAndParent(key, parentId) {
        return await this.childrensRepository.find({ where: { catalogCode: key, parentId } });
    }
    async getChildrenByKeys(keys) {
        return await this.childrensRepository.find({ where: { catalogCode: (0, typeorm_2.In)(keys) } });
    }
};
exports.CatalogsService = CatalogsService;
exports.CatalogsService = CatalogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(parent_entity_1.Parent)),
    __param(1, (0, typeorm_1.InjectRepository)(child_entity_1.Child)),
    __param(2, (0, typeorm_1.InjectEntityManager)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.EntityManager])
], CatalogsService);
//# sourceMappingURL=catalogs.service.js.map