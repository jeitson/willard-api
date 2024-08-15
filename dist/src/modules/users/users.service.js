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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const biz_exception_1 = require("../../core/common/exceptions/biz.exception");
const error_code_constant_1 = require("../../core/constants/error-code.constant");
const paginate_1 = require("../../core/helper/paginate");
const rol_entity_1 = require("../roles/entities/rol.entity");
const user_rol_entity_1 = require("./entities/user-rol.entity");
let UsersService = class UsersService {
    constructor(userRepository, entityManager, rolesRepository, userRolRepository) {
        this.userRepository = userRepository;
        this.entityManager = entityManager;
        this.rolesRepository = rolesRepository;
        this.userRolRepository = userRolRepository;
    }
    async findAll({ page, pageSize, email, name, }) {
        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'userRol')
            .leftJoinAndSelect('userRol.role', 'role')
            .where('1=1');
        if (name) {
            queryBuilder.andWhere('user.name LIKE :name', { name: `%${name}%` });
        }
        if (email) {
            queryBuilder.andWhere('user.email LIKE :email', { email: `%${email}%` });
        }
        return (0, paginate_1.paginate)(queryBuilder, {
            page,
            pageSize,
        });
    }
    async findUserById(id) {
        return this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'userRol')
            .leftJoinAndSelect('userRol.role', 'role')
            .where('user.id = :id', { id })
            .getOne();
    }
    async create({ email, roles, ...data }) {
        const exists = await this.userRepository.findOneBy({ email });
        if (exists) {
            throw new biz_exception_1.BusinessException(error_code_constant_1.ErrorEnum.SYSTEM_USER_EXISTS);
        }
        await this.entityManager.transaction(async (manager) => {
            const user = manager.create(user_entity_1.User, {
                email,
                ...data
            });
            await manager.save(user);
            if (roles && roles.length > 0) {
                const _roles = await this.rolesRepository.find({ where: { id: (0, typeorm_2.In)(roles) } });
                for (const role of _roles) {
                    const userRole = manager.create(user_rol_entity_1.UserRole, {
                        user,
                        role
                    });
                    await manager.save(userRole);
                }
            }
        });
    }
    async update(id, data) {
        await this.entityManager.transaction(async (manager) => {
            const { roles, ...userData } = data;
            await manager.update(user_entity_1.User, id, userData);
            if (roles) {
                await manager.delete(user_rol_entity_1.UserRole, { usuarioId: id });
                const userRoles = roles.map(roleId => manager.create(user_rol_entity_1.UserRole, {
                    userId: id,
                    rolId: roleId
                }));
                await manager.save(user_rol_entity_1.UserRole, userRoles);
            }
        });
    }
    async addRolToUser(userId, rolId) {
        const user = await this.userRepository.findOneBy({ id: userId });
        const rol = await this.rolesRepository.findOneBy({ id: rolId });
        if (!user || !rol) {
            throw new Error('Usuario o Rol no encontrado');
        }
        const userRol = new user_rol_entity_1.UserRole();
        userRol.user = user;
        userRol.role = rol;
        return this.userRolRepository.save(userRol);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectEntityManager)()),
    __param(2, (0, typeorm_1.InjectRepository)(rol_entity_1.Role)),
    __param(3, (0, typeorm_1.InjectRepository)(user_rol_entity_1.UserRole)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.EntityManager,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map