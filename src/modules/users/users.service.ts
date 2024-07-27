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

@Injectable()
export class UsersService {

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		// @InjectRepository(RoleEntity)
		// private readonly roleRepository: Repository<RoleEntity>,
		@InjectEntityManager() private entityManager: EntityManager,
	) { }

	async findAll({
		page,
		pageSize,
		Email,
		Nombre
	}: UserQueryDto): Promise<Pagination<User>> {
		const queryBuilder = this.userRepository
			.createQueryBuilder('user')
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
		return this.userRepository.findOneBy({
			Id: id
		});
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
}
