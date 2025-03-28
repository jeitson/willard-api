import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { In, Like, Not, Repository } from 'typeorm';
import { ClientBranch, ClientCreateDto, ClientQueryDto, ClientUpdateDto } from './dto/client.dto';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { UserContextService } from '../users/user-context.service';
import { Branch } from './entities/client_branch.entity';

@Injectable()
export class ClientsService {
	constructor(
		@InjectRepository(Client)
		private readonly clientsRepository: Repository<Client>,
		@InjectRepository(Branch)
		private readonly branchsRepository: Repository<Branch>,
		private readonly userContextService: UserContextService
	) { }

	async create({
		name,
		businessName,
		branchs,
		...clientCreateDto
	}: ClientCreateDto): Promise<Client> {
		const upperCaseName = name.toUpperCase();
		const upperCaseBusinessName = businessName.toUpperCase();

		const existingClient = await this.clientsRepository.findOne({
			where: { name: In([upperCaseName, upperCaseBusinessName]) },
		});

		if (existingClient) {
			throw new BusinessException('Ya existe un cliente con este nombre o razón social');
		}

		const userId = this.userContextService.getUserDetails().id;

		const newClient = this.clientsRepository.create({
			...clientCreateDto,
			name: upperCaseName,
			businessName: upperCaseBusinessName,
			createdBy: userId,
			modifiedBy: userId,
		});

		const savedClient = await this.clientsRepository.save(newClient);

		const savedBranchs = await this.processBranchs(branchs, userId, savedClient);

		return { ...savedClient, branchs: savedBranchs } as any;
	}

	async update(
		id: number,
		{ name, businessName, branchs, ...updatedData }: ClientUpdateDto
	): Promise<Client> {
		const client = await this.clientsRepository.findOne({ where: { id } });

		if (!client) {
			throw new BusinessException('Cliente no encontrado');
		}

		const upperCaseName = name.toUpperCase();
		const upperCaseBusinessName = businessName.toUpperCase();

		const existingClientByName = await this.clientsRepository.findOne({
			where: { name: upperCaseName, id: Not(id) },
		});

		if (existingClientByName) {
			throw new BusinessException('Ya existe un cliente con este nombre');
		}

		const userId = this.userContextService.getUserDetails().id;

		Object.assign(client, {
			name: upperCaseName,
			businessName: upperCaseBusinessName,
			...updatedData,
			modifiedBy: userId,
		});

		const updatedClient = await this.clientsRepository.save(client);

		const savedBranchs = await this.processBranchs(branchs, userId, updatedClient);

		return { ...updatedClient, branchs: savedBranchs } as any;
	}


	private async processBranchs(
		branchs: ClientBranch[],
		userId: string,
		client: Client
	): Promise<Branch[]> {
		if (!branchs || branchs.length === 0) {
			return [];
		}

		const existingBranchs = branchs.filter((branch) => branch.id);
		const newBranchs = branchs.filter((branch) => !branch.id);

		// Crear nuevas sucursales
		const createdBranchs = this.branchsRepository.create(
			newBranchs.map((branch) => ({
				...branch,
				client,
				createdBy: userId,
				modifiedBy: userId,
			}))
		);

		// Actualizar sucursales existentes
		const updatedBranchs = existingBranchs.map((branch) =>
			this.branchsRepository.create({
				...branch,
				client,
				modifiedBy: userId,
			})
		);

		// Guardar todas las sucursales (nuevas y actualizadas)
		return this.branchsRepository.save([...createdBranchs, ...updatedBranchs]);
	}

	async findAll({
		page,
		pageSize,
		name
	}: ClientQueryDto): Promise<Pagination<Client>> {
		const queryBuilder = this.clientsRepository
			.createQueryBuilder('client')
			.leftJoinAndSelect('client.branchs', 'branch')

			.where({
				...(name ? { name: Like(`%${name}%`) } : null),
			})
			.orderBy('client.name', 'ASC');

		return paginate<Client>(queryBuilder, {
			page,
			pageSize,
		});
	}

	async findOne(id: number): Promise<Client> {
		const client = await this.clientsRepository.findOne({ where: { id }, relations: ['branch'] });
		if (!client) {
			throw new BusinessException('Cliente no encontrado');
		}
		return client;
	}

	async changeStatus(id: number): Promise<Client> {
		const client = await this.findOne(id);
		client.status = !client.status;

		const modifiedBy = this.userContextService.getUserDetails().id;

		return await this.clientsRepository.save({ ...client, modifiedBy });
	}

	async remove(id: number): Promise<void> {
		const client = await this.findOne(id);
		await this.clientsRepository.remove(client);
	}
}
