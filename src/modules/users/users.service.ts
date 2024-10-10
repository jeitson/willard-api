import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, In, Repository } from 'typeorm';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/core/constants/error-code.constant';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { UserDto, UserOAuthDto, UserQueryDto, UserUpdateDto } from './dto/user.dto';
import { Role } from '../roles/entities/rol.entity';
import { UserRole } from './entities/user-rol.entity';
import { UserContextService } from './user-context.service';

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
		private userContextService: UserContextService
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

	async getProfile(): Promise<User | undefined> {
		const id = this.userContextService.getUserDetails().id;

		return this.findUserById(id);
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
			const user_id = this.userContextService.getUserDetails()?.id;

			const user = manager.create(User, {
				email,
				...data,
				createdBy: user_id,
				modifiedBy: user_id,
			});

			await manager.save(user);

			if (roles && roles.length > 0) {

				const _roles = await this.rolesRepository.find({ where: { id: In(roles) } });

				for (const role of _roles) {
					const userRole = manager.create(UserRole, {
						user,
						role,
						createdBy: user_id,
						modifiedBy: user_id,
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
			referencePH: '',
			referenceWLL: '',
			roles: []
		});
	}

	async update(id: string, data: UserUpdateDto): Promise<void> {
		const user = await this.userRepository.findOneBy({ id: +id });

		if (!user) {
			throw new BusinessException('No existe el usuario', 400);
		}

		await this.entityManager.transaction(async (manager) => {
			let { roles, ...updatedData } = data;

			updatedData = Object.assign(user, updatedData);

			const user_id = this.userContextService.getUserDetails().id;

			await manager.update(User, id, { ...updatedData, modifiedBy: user_id });

			if (roles) {
				await manager.delete(UserRole, { usuarioId: id });

				const userRoles = roles.map(roleId => manager.create(UserRole, {
					userId: id,
					rolId: roleId,
					createdBy: user_id,
					modifiedBy: user_id,
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

		const user_id = this.userContextService.getUserDetails().id;

		const userRol = new UserRole();
		userRol.user = user;
		userRol.role = rol;
		userRol.createdBy = user_id;
		userRol.updatedBy = user_id;

		return this.userRolRepository.save(userRol);
	}

	async getUserRoles({ sub: id, ...content }): Promise<string[]> {
		const user = await this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.roles', 'role')
			.where('user.oauthId = :id', { id })
			.getOne();

		if (!user) {
			throw new Error('Usuario no encontrado');
		}

		this.userContextService.setUserDetails(user);
		this.userContextService.setUser({ sub: id, ...content });

		return user.roles.map(({ roleId }) => roleId)
	}
}
