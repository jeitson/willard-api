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
import { Rol } from '../roles/entities/rol.entity';
import { UserRol } from './entities/user-rol.entity';

@Injectable()
export class UsersService {

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectEntityManager() private entityManager: EntityManager,
		@InjectRepository(Rol)
		private readonly rolesRepository: Repository<Rol>,
		@InjectRepository(UserRol)
		private readonly userRolRepository: Repository<UserRol>,
	) { }

	async findAll({
		page,
		pageSize,
		Email,
		Nombre
	}: UserQueryDto): Promise<Pagination<User>> {
		const queryBuilder = this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.roles', 'userRol')
			.leftJoinAndSelect('userRol.rol', 'rol')
			.where({
				...(Nombre ? { Nombre: Like(`%${Nombre}%`) } : null),
				...(Email ? { Email: Like(`%${Email}%`) } : null),
			});

		return paginate<User>(queryBuilder, {
			page,
			pageSize,
		});
	}

	async findUserById(id: string): Promise<User | undefined> {
		return this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.roles', 'userRol')
			.leftJoinAndSelect('userRol.rol', 'rol')
			.where('user.Id = :id', { id })
			.getOne();
	}
	async create({
		Email,
		...data
	}: UserDto): Promise<void> {
		const exists = await this.userRepository.findOneBy({ Email });

		if (!isEmpty(exists))
			throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS);

		await this.entityManager.transaction(async (manager) => {

			const u = manager.create(User, {
				Email,
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


	async addRolToUser(userId: number, rolId: number): Promise<UserRol> {
		const user = await this.userRepository.findOneBy({ Id: userId });
		const rol = await this.rolesRepository.findOneBy({ Id: rolId });

		if (!user || !rol) {
			throw new Error('Usuario o Rol no encontrado');
		}

		const userRol = new UserRol();
		userRol.usuario = user;
		userRol.rol = rol;

		return this.userRolRepository.save(userRol);
	}
}
