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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const client_entity_1 = require("./entities/client.entity");
const typeorm_2 = require("typeorm");
const biz_exception_1 = require("../../core/common/exceptions/biz.exception");
const paginate_1 = require("../../core/helper/paginate");
let ClientsService = class ClientsService {
    constructor(clientsRepository) {
        this.clientsRepository = clientsRepository;
    }
    async create(clientCreateDto) {
        const client = this.clientsRepository.create(clientCreateDto);
        return await this.clientsRepository.save(client);
    }
    async update(id, clientUpdateDto) {
        const client = await this.clientsRepository.findOne({ where: { id } });
        if (!client) {
            throw new biz_exception_1.BusinessException('Cliente no encontrado');
        }
        Object.assign(client, clientUpdateDto);
        return await this.clientsRepository.save(client);
    }
    async findAll({ page, pageSize, name }) {
        const queryBuilder = this.clientsRepository
            .createQueryBuilder('cliente')
            .where({
            ...(name ? { name: (0, typeorm_2.Like)(`%${name}%`) } : null),
        });
        return (0, paginate_1.paginate)(queryBuilder, {
            page,
            pageSize,
        });
    }
    async findOne(id) {
        const client = await this.clientsRepository.findOne({ where: { id } });
        if (!client) {
            throw new biz_exception_1.BusinessException('Cliente no encontrado');
        }
        return client;
    }
    async changeStatus(id, status) {
        const client = await this.findOne(id);
        client.status = status;
        return await this.clientsRepository.save(client);
    }
    async remove(id) {
        const client = await this.findOne(id);
        await this.clientsRepository.remove(client);
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClientsService);
//# sourceMappingURL=clients.service.js.map