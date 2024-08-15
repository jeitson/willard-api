import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, In, Like, Repository } from 'typeorm';
import { isEmpty } from 'class-validator';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/core/constants/error-code.constant';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { UserDto, UserOAuthDto, UserQueryDto, UserUpdateDto } from './dto/user.dto';
import { Role } from '../roles/entities/rol.entity';
import { UserRole } from './entities/user-rol.entity';

@Injectable()
export class UsersService {

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectEntityManager() private entityManager: EntityManager,
		@InjectRepository(Role)
		private readonly rolesRepository: Repository<Role>,
		@InjectRepository(UserRole)
		private readonly userRolRepository: Repository<UserRole>,
	) { }

	async findAll({
		page,
		pageSize,
		email,
		name,
	}: UserQueryDto): Promise<Pagination<User>> {
		const queryBuilder = this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.roles', 'userRol')
			.leftJoinAndSelect('userRol.role', 'role')
			.where('1=1')

		if (name) {
			queryBuilder.andWhere('user.name LIKE :name', { name: `%${name}%` });
		}

		if (email) {
			queryBuilder.andWhere('user.email LIKE :email', { email: `%${email}%` });
		}

		return paginate<User>(queryBuilder, {
			page,
			pageSize,
		});
	}


	async findUserById(id: string): Promise<User | undefined> {
		return this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.roles', 'userRol')
			.leftJoinAndSelect('userRol.role', 'role')
			.where('user.id = :id', { id })
			.getOne();
	}

	async create({
		email,
		roles,
		...data
	}: UserDto): Promise<void> {
		const exists = await this.userRepository.findOneBy({ email });

		if (exists) {
			throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS);
		}

		await this.entityManager.transaction(async (manager) => {
			const user = manager.create(User, {
				email,
				...data
			});

			await manager.save(user);

			if (roles && roles.length > 0) {

				const _roles = await this.rolesRepository.find({ where: { id: In(roles)} });

				for (const role of _roles) {
					const userRole = manager.create(UserRole, {
						user,
						role
					});
					await manager.save(userRole);
				}
			}
		});
	}

	async createByOAuth0({ user_id: oauthId, ...data }: UserOAuthDto): Promise<void> {
		return this.create({
			description: 'CREATED BY OAUTH0',
			oauthId,
			...data,
			roles: []
		});
	}

	async update(id: string, data: UserUpdateDto): Promise<void> {
		await this.entityManager.transaction(async (manager) => {
			const { roles, ...userData } = data;

			await manager.update(User, id, userData);

			if (roles) {
				await manager.delete(UserRole, { usuarioId: id });

				const userRoles = roles.map(roleId => manager.create(UserRole, {
					userId: id,
					rolId: roleId
				}));
				await manager.save(UserRole, userRoles);
			}
		});
	}


	async addRolToUser(userId: number, rolId: number): Promise<UserRole> {
		const user = await this.userRepository.findOneBy({ id: userId });
		const rol = await this.rolesRepository.findOneBy({ id: rolId });

		if (!user || !rol) {
			throw new Error('Usuario o Rol no encontrado');
		}

		const userRol = new UserRole();
		userRol.user = user;
		userRol.role = rol;

		return this.userRolRepository.save(userRol);
	}
}
