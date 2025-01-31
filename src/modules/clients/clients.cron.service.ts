import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { In, Repository } from 'typeorm';
import { ClientCreateDto } from './dto/client.dto';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';

@Injectable()
export class ClientsCronService {
	constructor(
		@InjectRepository(Client)
		private readonly clientsRepository: Repository<Client>
	) { }

	async create({ name, businessName, ...clientCreateDto}: ClientCreateDto): Promise<Client> {
		name = name.toUpperCase();
		businessName = businessName.toUpperCase();

		const isExist = await this.clientsRepository.findOne({ where: { name: In([name, businessName]) }});

		if (isExist) {
			throw new BusinessException('Ya existe el cliente');
		}

		const client = this.clientsRepository.create({ ...clientCreateDto, name, businessName });
		return await this.clientsRepository.save(client);
	}
}
