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
exports.ConsultantsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const consultant_entity_1 = require("./entities/consultant.entity");
const typeorm_2 = require("typeorm");
const biz_exception_1 = require("../../core/common/exceptions/biz.exception");
const paginate_1 = require("../../core/helper/paginate");
let ConsultantsService = class ConsultantsService {
    constructor(consultantsRepository) {
        this.consultantsRepository = consultantsRepository;
    }
    async create(consultantCreateDto) {
        const consultant = this.consultantsRepository.create(consultantCreateDto);
        return await this.consultantsRepository.save(consultant);
    }
    async update(id, consultantUpdateDto) {
        const consultant = await this.consultantsRepository.findOne({ where: { id } });
        if (!consultant) {
            throw new biz_exception_1.BusinessException('Asesor no encontrado', 400);
        }
        Object.assign(consultant, consultantUpdateDto);
        return await this.consultantsRepository.save(consultant);
    }
    async findAll({ page, pageSize, name }) {
        const queryBuilder = this.consultantsRepository
            .createQueryBuilder('asesor')
            .where({
            ...(name ? { name: (0, typeorm_2.Like)(`%${name}%`) } : null),
        });
        return (0, paginate_1.paginate)(queryBuilder, {
            page,
            pageSize,
        });
    }
    async findOne(id) {
        const consultant = await this.consultantsRepository.findOne({ where: { id } });
        if (!consultant) {
            throw new biz_exception_1.BusinessException('Asesor no encontrado', 400);
        }
        return consultant;
    }
    async changeStatus(id, status) {
        const consultant = await this.findOne(id);
        consultant.status = status;
        return await this.consultantsRepository.save(consultant);
    }
    async remove(id) {
        const consultant = await this.findOne(id);
        await this.consultantsRepository.remove(consultant);
    }
};
exports.ConsultantsService = ConsultantsService;
exports.ConsultantsService = ConsultantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(consultant_entity_1.Consultant)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConsultantsService);
//# sourceMappingURL=consultants.service.js.map