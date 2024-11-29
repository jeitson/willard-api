import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { In, Like, Repository } from 'typeorm';
import { ClientCreateDto, ClientQueryDto, ClientUpdateDto } from './dto/client.dto';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { UserContextService } from '../users/user-context.service';

@Injectable()
export class ClientsService {
	constructor(
		@InjectRepository(Client)
		private readonly clientsRepository: Repository<Client>,
		private readonly userContextService: UserContextService
	) { }

	async create({ name, businessName, ...clientCreateDto}: ClientCreateDto): Promise<Client> {
		name = name.toUpperCase();
		businessName = businessName.toUpperCase();

		const isExist = await this.clientsRepository.findOne({ where: { name: In([name, businessName]) }});

		if (!isExist) {
			throw new BusinessException('Ya existe el cliente');
		}

		const user_id = this.userContextService.getUserDetails().id;

		const client = this.clientsRepository.create({ ...clientCreateDto, name, businessName, createdBy: user_id, modifiedBy: user_id });
		return await this.clientsRepository.save(client);
	}

	async update(id: number, { name, businessName, ...updatedData }: ClientUpdateDto): Promise<Client> {
		const client = await this.clientsRepository.findOne({ where: { id } });

		if (!client) {
			throw new BusinessException('Cliente no encontrado');
		}

		name = name.toUpperCase();
		businessName = businessName.toUpperCase();

		updatedData = Object.assign(client, { name, businessName, ...updatedData });
		const modifiedBy = this.userContextService.getUserDetails().id;

		return await this.clientsRepository.save({ ...updatedData, modifiedBy });
	}

	async findAll({
		page,
		pageSize,
		name
	}: ClientQueryDto): Promise<Pagination<Client>> {
		const queryBuilder = this.clientsRepository
			.createQueryBuilder('cliente')
			.where({
				...(name ? { name: Like(`%${name}%`) } : null),
			});

		return paginate<Client>(queryBuilder, {
			page,
			pageSize,
		});
	}

	async findOne(id: number): Promise<Client> {
		const client = await this.clientsRepository.findOne({ where: { id } });
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
