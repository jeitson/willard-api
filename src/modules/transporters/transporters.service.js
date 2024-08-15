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
exports.TransportersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const transporter_entity_1 = require("./entities/transporter.entity");
const typeorm_2 = require("typeorm");
const biz_exception_1 = require("../../core/common/exceptions/biz.exception");
const paginate_1 = require("../../core/helper/paginate");
let TransportersService = class TransportersService {
    constructor(transportersRepository) {
        this.transportersRepository = transportersRepository;
    }
    async create(transporterCreateDto) {
        const transporter = this.transportersRepository.create(transporterCreateDto);
        return await this.transportersRepository.save(transporter);
    }
    async update(id, transporterUpdateDto) {
        const transporter = await this.transportersRepository.findOne({ where: { id } });
        if (!transporter) {
            throw new biz_exception_1.BusinessException('Transportador no encontrado', 400);
        }
        Object.assign(transporter, transporterUpdateDto);
        return await this.transportersRepository.save(transporter);
    }
    async findAll({ page, pageSize, name }) {
        const queryBuilder = this.transportersRepository
            .createQueryBuilder('transportador')
            .where({
            ...(name ? { name: (0, typeorm_2.Like)(`%${name}%`) } : null),
        });
        return (0, paginate_1.paginate)(queryBuilder, {
            page,
            pageSize,
        });
    }
    async findOne(id) {
        const transporter = await this.transportersRepository.findOne({ where: { id } });
        if (!transporter) {
            throw new biz_exception_1.BusinessException('Transportador no encontrado', 400);
        }
        return transporter;
    }
    async changeStatus(id, status) {
        const transporter = await this.findOne(id);
        transporter.status = status;
        return await this.transportersRepository.save(transporter);
    }
    async remove(id) {
        const transporter = await this.findOne(id);
        await this.transportersRepository.remove(transporter);
    }
};
exports.TransportersService = TransportersService;
exports.TransportersService = TransportersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transporter_entity_1.Transporter)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TransportersService);
//# sourceMappingURL=transporters.service.js.map