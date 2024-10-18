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
import { Auth0Service } from './auth0.service';
import { UserCollectionSite } from './entities/user-collection_site.entity';
import { CollectionSite } from '../collection_sites/entities/collection_site.entity';

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
		@InjectRepository(CollectionSite)
		private readonly collectionSitesRepository: Repository<CollectionSite>,
		@InjectRepository(UserCollectionSite)
		private readonly userCollectionSiteRepository: Repository<UserCollectionSite>,
		private userContextService: UserContextService,
		private auth0Service: Auth0Service
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
			.leftJoinAndSelect('user.collectionSites', 'collectionSites')
			.leftJoinAndSelect('collectionSites.collectionSite', 'collectionSite')
			.where('1=1')

		if (name) {
			queryBuilder.andWhere('user.name LIKE :name', { name: `%${name}%` });
		}

		if (email) {
			queryBuilder.andWhere('user.email LIKE :email', { email: `%${email}%` });
		}

		return paginate<User>(queryBuilder, {
			page,
			pageSize: 30,
		});
	}


	async findUserById(id: string): Promise<User | undefined> {
		return this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.roles', 'userRol')
			.leftJoinAndSelect('userRol.role', 'role')
			.leftJoinAndSelect('user.collectionSites', 'collectionSites')
			.leftJoinAndSelect('collectionSites.collectionSite', 'collectionSite')
			.where('user.id = :id', { id })
			.getOne();
	}


	async getProfile(): Promise<User | undefined> {
		const id = this.userContextService.getUserDetails().id;

		const user = await this.findUserById(id);

		user.roles = user.roles.map((role) => ({ ...role, role: JSON.parse(role.role.menu) }))

		return user;
	}

	async create({
		email,
		roles,
		collectionSites,
		...data
	}: UserDto): Promise<void> {
		const exists = await this.userRepository.findOneBy({ email });

		if (exists) {
			throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS);
		}

		await this.entityManager.transaction(async (manager) => {
			const user_id = this.userContextService.getUserDetails()?.id;

			try {
				let auth0User = {
					user_id: data.oauthId
				};

				if (data.description !== 'CREATED BY OAUTH0') {
					auth0User = await this.auth0Service.createUser({
						email,
						connection: 'Username-Password-Authentication',
						password: data.password,
						user_metadata: { roles, collectionSites, ...data }
					});
				}

				const user = manager.create(User, {
					auth0Id: auth0User.user_id,
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

				if (collectionSites && collectionSites.length > 0) {
					const _collectionSites = await this.collectionSitesRepository.find({ where: { id: In(collectionSites) } });

					for (const collectionSite of _collectionSites) {
						const userCollectionSite = manager.create(UserCollectionSite, {
							user,
							collectionSite,
							createdBy: user_id,
							modifiedBy: user_id,
						});
						await manager.save(userCollectionSite);
					}
				}

			} catch (error) {
				throw new BusinessException('Error en la creación del usuario' + error.message, 400);
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
			roles: [],
			collectionSites: []
		});
	}

	async update(id: string, data: UserUpdateDto): Promise<void> {
		const user = await this.userRepository.findOneBy({ id: +id });

		if (!user) {
			throw new BusinessException('No existe el usuario', 400);
		}

		await this.entityManager.transaction(async (manager) => {
			let { roles, collectionSites, ...updatedData } = data;
			const user_id = this.userContextService.getUserDetails().id;

			try {
				// await this.auth0Service.updateUser(user.oauthId, { email: updatedData.email, ...updatedData });

				updatedData = Object.assign(user, updatedData);
				await manager.update(User, id, { ...updatedData, modifiedBy: user_id });

				if (roles && roles.length > 0) {
					await manager.delete(UserRole, { user: { id: +id } });

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

				if (collectionSites && collectionSites.length > 0) {
					await manager.delete(UserCollectionSite, { user: { id: +id } });

					const _collectionSites = await this.collectionSitesRepository.find({ where: { id: In(collectionSites) } });

					for (const collectionSite of _collectionSites) {
						const userCollectionSite = manager.create(UserCollectionSite, {
							user,
							collectionSite,
							createdBy: user_id,
							modifiedBy: user_id,
						});
						await manager.save(userCollectionSite);
					}
				}

			} catch (error) {
				throw new BusinessException('Error actualizando usuario en Auth0: ' + error.message, 400);
			}
		});
	}

	async addCollectionSiteToUser(userId: number, collectionSiteId: number): Promise<UserCollectionSite> {
		const user = await this.userRepository.findOneBy({ id: userId });
		const collectionSite = await this.collectionSitesRepository.findOneBy({ id: collectionSiteId });

		if (!user || !collectionSite) {
			throw new Error('Usuario o Sede de acopio no encontrado');
		}

		const user_id = this.userContextService.getUserDetails().id;

		const userCollectionSite = new UserCollectionSite();
		userCollectionSite.user = user;
		userCollectionSite.collectionSite = collectionSite;
		userCollectionSite.createdBy = user_id;
		userCollectionSite.updatedBy = user_id;

		return this.userCollectionSiteRepository.save(userCollectionSite);
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

	async getUserRoles({ sub: id, ...content }: any): Promise<string[]> {
		let user = await this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.roles', 'role')
			.leftJoinAndSelect('user.collectionSites', 'collectionSites')
			.where('user.oauthId = :id', { id })
			.getOne();

		if (!user) {
			await this.createByOAuth0({ user_id: id, ...content });

			user = await this.userRepository
				.createQueryBuilder('user')
				.leftJoinAndSelect('user.roles', 'role')
				.leftJoinAndSelect('collectionSites.collectionSite', 'collectionSite')
				.where('user.oauthId = :id', { id })
				.getOne();

			if (!user) {
				throw new Error('Error al crear el usuario');
			}
		}

		this.userContextService.setUserDetails(user);
		this.userContextService.setUser({ sub: id, ...content });

		return user.roles.map(({ roleId }) => roleId);
	}

}
