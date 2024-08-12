import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Like, Repository } from 'typeorm';
import { isEmpty } from 'class-validator';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/core/constants/error-code.constant';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { UserDto, UserQueryDto, UserUpdateDto } from './dto/user.dto';
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
		...data
	}: UserDto): Promise<void> {
		const exists = await this.userRepository.findOneBy({ email });

		if (!isEmpty(exists))
			throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS);

		await this.entityManager.transaction(async (manager) => {

			const u = manager.create(User, {
				email,
				...data
			});

			await manager.save(u);
		});
	}

	async update(
		id: string,
		data: UserUpdateDto,
	): Promise<void> {
		await this.entityManager.transaction(async (manager) => {
			await manager.update(User, id, data);
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
