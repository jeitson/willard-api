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
exports.CollectionSitesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const collection_site_entity_1 = require("./entities/collection_site.entity");
const biz_exception_1 = require("../../core/common/exceptions/biz.exception");
const paginate_1 = require("../../core/helper/paginate");
let CollectionSitesService = class CollectionSitesService {
    constructor(collectionSiteRepository) {
        this.collectionSiteRepository = collectionSiteRepository;
    }
    async create(createCollectionSiteDto) {
        const collectionSite = this.collectionSiteRepository.create(createCollectionSiteDto);
        return await this.collectionSiteRepository.save(collectionSite);
    }
    async findAll({ page, pageSize, name }) {
        const queryBuilder = this.collectionSiteRepository
            .createQueryBuilder('sedes_acopio')
            .where({
            ...(name ? { name: (0, typeorm_2.Like)(`%${name}%`) } : null),
        });
        return (0, paginate_1.paginate)(queryBuilder, {
            page,
            pageSize,
        });
    }
    async findOne(id) {
        const collectionSite = await this.collectionSiteRepository.findOneBy({ id });
        if (!collectionSite) {
            throw new biz_exception_1.BusinessException(`Centro de acopio con ID ${id} no encontrado`, 404);
        }
        return collectionSite;
    }
    async update(id, updateCollectionSiteDto) {
        await this.collectionSiteRepository.update(id, updateCollectionSiteDto);
        const updatedCollectionSite = await this.collectionSiteRepository.findOneBy({ id });
        if (!updatedCollectionSite) {
            throw new biz_exception_1.BusinessException(`Centro de acopio con ID ${id} no encontrado`, 404);
        }
        return updatedCollectionSite;
    }
    async changeStatus(id, status) {
        const collectionSite = await this.collectionSiteRepository.findOneBy({ id });
        if (!collectionSite) {
            throw new biz_exception_1.BusinessException(`Centro de acopio con ID ${id} no encontrado`, 404);
        }
        collectionSite.status = status;
        return await this.collectionSiteRepository.save(collectionSite);
    }
    async remove(id) {
        const result = await this.collectionSiteRepository.delete(id);
        if (result.affected === 0) {
            throw new biz_exception_1.BusinessException(`Centro de acopio con ID ${id} no encontrado`, 404);
        }
    }
};
exports.CollectionSitesService = CollectionSitesService;
exports.CollectionSitesService = CollectionSitesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(collection_site_entity_1.CollectionSite)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CollectionSitesService);
//# sourceMappingURL=collection_sites.service.js.map