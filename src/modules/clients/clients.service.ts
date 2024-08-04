import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Like, Repository } from 'typeorm';
import { ClientCreateDto, ClientQueryDto, ClientUpdateDto } from './dto/client.dto';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';

@Injectable()
export class ClientsService {
	constructor(
		@InjectRepository(Client)
		private readonly clientsRepository: Repository<Client>,
	) { }

	async create(clientCreateDto: ClientCreateDto): Promise<Client> {
		const client = this.clientsRepository.create(clientCreateDto);
		return await this.clientsRepository.save(client);
	}

	async update(id: number, clientUpdateDto: ClientUpdateDto): Promise<Client> {
		const client = await this.clientsRepository.findOne({ where: { Id: id } });
		if (!client) {
			throw new BusinessException('Cliente no encontrado');
		}
		Object.assign(client, clientUpdateDto);
		return await this.clientsRepository.save(client);
	}

	async findAll({
		page,
		pageSize,
		Nombre
	}: ClientQueryDto): Promise<Pagination<Client>> {
		const queryBuilder = this.clientsRepository
			.createQueryBuilder('cliente')
			.where({
				...(Nombre ? { Nombre: Like(`%${Nombre}%`) } : null),
			});

		return paginate<Client>(queryBuilder, {
			page,
			pageSize,
		});
	}

	async findOne(id: number): Promise<Client> {
		const client = await this.clientsRepository.findOne({ where: { Id: id } });
		if (!client) {
			throw new BusinessException('Cliente no encontrado');
		}
		return client;
	}

	async changeStatus(id: number, status: boolean): Promise<Client> {
		const client = await this.findOne(id);
		client.Estado = status;
		return await this.clientsRepository.save(client);
	}

	async remove(id: number): Promise<void> {
		const client = await this.findOne(id);
		await this.clientsRepository.remove(client);
	}
}
