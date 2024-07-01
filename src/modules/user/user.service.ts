/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { isEmpty, isNil } from 'lodash';

import { EntityManager, In, Like, Repository } from 'typeorm';

import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/core/constants/error-code.constant';
import {
	ROOT_ROLE_ID,
	SYS_USER_INITPASSWORD,
} from 'src/core/constants/system.constant';

import { paginate } from 'src/core/helper/paginate';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { AccountUpdateDto } from 'src/modules/auth/dto/account.dto';
import { RegisterDto } from 'src/modules/auth/dto/auth.dto';

import { md5, randomValue } from 'src/core/utils';

import { DeptEntity } from '../system/dept/dept.entity';
import { ParamConfigService } from '../system/param-config/param-config.service';
import { RoleEntity } from '../system/role/role.entity';
import { UserStatus } from './constant';
import { PasswordUpdateDto } from './dto/password.dto';
import { UserDto, UserQueryDto, UserUpdateDto } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { AccountInfo } from './user.model';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(RoleEntity)
		private readonly roleRepository: Repository<RoleEntity>,
		@InjectEntityManager() private entityManager: EntityManager,
		private readonly paramConfigService: ParamConfigService,
	) {}

	// Encuentra un usuario por ID
	async findUserById(id: string): Promise<UserEntity | undefined> {
		return this.userRepository
			.createQueryBuilder('user')
			.where({
				id,
				status: UserStatus.Enabled,
			})
			.getOne();
	}

	// Encuentra un usuario por nombre de usuario
	async findUserByUserName(
		username: string,
	): Promise<UserEntity | undefined> {
		return this.userRepository
			.createQueryBuilder('user')
			.where({
				username,
				status: UserStatus.Enabled,
			})
			.getOne();
	}

	// Encuentra un usuario por nombre de usuario
	async findUserByEmail(email: string): Promise<UserEntity | undefined> {
		return this.userRepository
			.createQueryBuilder('user')
			.where({
				email,
				status: UserStatus.Enabled,
			})
			.getOne();
	}

	// Obtiene información de cuenta por ID de usuario
	async getAccountInfo(uid: string): Promise<AccountInfo> {
		const user: UserEntity = await this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.roles', 'role')
			.where(`user.id = :uid`, { uid })
			.getOne();

		if (isEmpty(user))
			throw new BusinessException(ErrorEnum.USER_NOT_FOUND);

		delete user?.psalt; // Borra el campo 'psalt' del usuario antes de devolverlo

		return user;
	}

	// Actualiza información de cuenta
	async updateAccountInfo(
		uid: string,
		info: AccountUpdateDto,
	): Promise<void> {
		const user = await this.userRepository.findOneBy({ id: uid });
		if (isEmpty(user))
			throw new BusinessException(ErrorEnum.USER_NOT_FOUND);

		const data = {
			...(info.nickname ? { nickname: info.nickname } : null),
			...(info.avatar ? { avatar: info.avatar } : null),
			...(info.email ? { email: info.email } : null),
			...(info.phone ? { phone: info.phone } : null),
			...(info.qq ? { qq: info.qq } : null),
			...(info.remark ? { remark: info.remark } : null),
		};

		await this.userRepository.update(uid, data);
	}

	// Actualiza la contraseña
	async updatePassword(uid: string, dto: PasswordUpdateDto): Promise<void> {
		const user = await this.userRepository.findOneBy({ id: uid });
		if (isEmpty(user))
			throw new BusinessException(ErrorEnum.USER_NOT_FOUND);

		const comparePassword = md5(`${dto.oldPassword}${user.psalt}`);
		if (user.password !== comparePassword)
			throw new BusinessException(ErrorEnum.PASSWORD_MISMATCH);

		const password = md5(`${dto.newPassword}${user.psalt}`);
		await this.userRepository.update({ id: uid }, { password });
		await this.upgradePasswordV(user.id);
	}

	// Actualiza la contraseña directamente sin comprobar la contraseña antigua
	async forceUpdatePassword(uid: string, password: string): Promise<void> {
		const user = await this.userRepository.findOneBy({ id: uid });

		const newPassword = md5(`${password}${user.psalt}`);
		await this.userRepository.update(
			{ id: uid },
			{ password: newPassword },
		);
		await this.upgradePasswordV(user.id);
	}

	// Crea un nuevo usuario
	async create({
		username,
		password,
		roleIds,
		deptId,
		...data
	}: UserDto): Promise<void> {
		const exists = await this.userRepository.findOneBy({ username });
		if (!isEmpty(exists))
			throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS);

		await this.entityManager.transaction(async (manager) => {
			const salt = randomValue(32);

			if (!password) {
				const initPassword =
					await this.paramConfigService.findValueByKey(
						SYS_USER_INITPASSWORD,
					);
				password = md5(`${initPassword ?? '123456'}${salt}`);
			} else {
				password = md5(`${password ?? '123456'}${salt}`);
			}

			const u = manager.create(UserEntity, {
				username,
				password,
				...data,
				psalt: salt,
				roles: await this.roleRepository.findBy({ id: In(roleIds) }),
				dept: await DeptEntity.findOneBy({ id: deptId }),
			});

			await manager.save(u);
		});
	}

	// Actualiza la información de un usuario
	async update(
		id: string,
		{ password, deptId, roleIds, status, ...data }: UserUpdateDto,
	): Promise<void> {
		await this.entityManager.transaction(async (manager) => {
			if (password) await this.forceUpdatePassword(id, password);

			await manager.update(UserEntity, id, {
				...data,
				status,
			});

			const user = await this.userRepository
				.createQueryBuilder('user')
				.leftJoinAndSelect('user.roles', 'roles')
				.leftJoinAndSelect('user.dept', 'dept')
				.where('user.id = :id', { id })
				.getOne();

			if (roleIds)
				await manager
					.createQueryBuilder()
					.relation(UserEntity, 'roles')
					.of(id)
					.addAndRemove(roleIds, user.roles);

			if (deptId)
				await manager
					.createQueryBuilder()
					.relation(UserEntity, 'dept')
					.of(id)
					.set(deptId);

			if (!status) {
				// Si se desactiva la cuenta
				await this.forbidden(id);
			}
		});
	}

	// Obtiene información detallada de un usuario por ID
	async info(id: string): Promise<UserEntity> {
		const user = await this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.roles', 'roles')
			.leftJoinAndSelect('user.dept', 'dept')
			.where('user.id = :id', { id })
			.getOne();

		delete user.password;
		delete user.psalt;

		return user;
	}

	// Elimina usuarios por lista de IDs
	async delete(userIds: string[]): Promise<void> {
		const rootUserId = await this.findRootUserId();
		if (userIds.includes(rootUserId))
			throw new BadRequestException(
				'No se puede eliminar al usuario root!',
			);

		await this.userRepository.delete(userIds);
	}

	// Encuentra el ID del usuario root
	async findRootUserId(): Promise<string> {
		const user = await this.userRepository.findOneBy({
			roles: { id: ROOT_ROLE_ID },
		});
		return user.id;
	}

	// Lista los usuarios con opciones de paginación y filtros
	async list({
		page,
		pageSize,
		username,
		nickname,
		deptId,
		email,
		status,
	}: UserQueryDto): Promise<Pagination<UserEntity>> {
		const queryBuilder = this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.dept', 'dept')
			.leftJoinAndSelect('user.roles', 'role')
			.where({
				...(username ? { username: Like(`%${username}%`) } : null),
				...(nickname ? { nickname: Like(`%${nickname}%`) } : null),
				...(email ? { email: Like(`%${email}%`) } : null),
				...(status ? { status } : null),
			});

		if (deptId) queryBuilder.andWhere('dept.id = :deptId', { deptId });

		return paginate<UserEntity>(queryBuilder, {
			page,
			pageSize,
		});
	}

	// Desactiva un usuario
	async forbidden(uid: string, accessToken?: string): Promise<void> {
		return; // Método vacío por ahora
	}

	// Desactiva múltiples usuarios
	async multiForbidden(uids: string[]): Promise<void> {
		// Código para desactivar múltiples usuarios
		return; // Método vacío por ahora
	}

	// Actualiza la versión de la contraseña del usuario
	async upgradePasswordV(id: string): Promise<void> {
		// Método vacío por ahora
		return;
	}

	// Verifica si un nombre de usuario existe
	async exist(username: string) {
		const user = await this.userRepository.findOneBy({ username });

		return !isNil(user);
	}

	// Registra un nuevo usuario
	async register({ email, username, ...data }: RegisterDto): Promise<void> {
		const exists = await this.userRepository.findOneBy({ email });
		if (!isEmpty(exists))
			throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS);

		const userExist = await this.exist(username);

		if (userExist)
			throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS);

		await this.entityManager.transaction(async (manager) => {
			const salt = randomValue(32);

			const password = md5(`${data.password ?? 'a123456'}${salt}`);

			const u = manager.create(UserEntity, {
				username,
				email,
				password,
				status: true,
				psalt: salt,
			});

			await manager.save(u);
		});
	}
}
