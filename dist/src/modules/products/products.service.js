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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const paginate_1 = require("../../core/helper/paginate");
const biz_exception_1 = require("../../core/common/exceptions/biz.exception");
let ProductsService = class ProductsService {
    constructor(productsRepository) {
        this.productsRepository = productsRepository;
    }
    async create(productCreateDto) {
        const product = this.productsRepository.create(productCreateDto);
        return await this.productsRepository.save(product);
    }
    async update(id, productUpdateDto) {
        const product = await this.productsRepository.findOne({ where: { id } });
        if (!product) {
            throw new biz_exception_1.BusinessException('Producto no encontrado', 400);
        }
        Object.assign(product, productUpdateDto);
        return await this.productsRepository.save(product);
    }
    async findAll({ page, pageSize, name }) {
        const queryBuilder = this.productsRepository
            .createQueryBuilder('producto')
            .where({
            ...(name ? { name: (0, typeorm_2.Like)(`%${name}%`) } : null),
        });
        return (0, paginate_1.paginate)(queryBuilder, {
            page,
            pageSize,
        });
    }
    async findOne(id) {
        const product = await this.productsRepository.findOne({ where: { id } });
        if (!product) {
            throw new biz_exception_1.BusinessException('Producto no encontrado', 400);
        }
        return product;
    }
    async changeStatus(id, status) {
        const product = await this.findOne(id);
        product.status = status;
        return await this.productsRepository.save(product);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productsRepository.remove(product);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map