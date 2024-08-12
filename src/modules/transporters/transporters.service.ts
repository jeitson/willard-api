import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transporter } from './entities/transporter.entity';
import { Like, Repository } from 'typeorm';
import { TransporterCreateDto, TransporterQueryDto, TransporterUpdateDto } from './dto/transporter.dto';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';

@Injectable()
export class TransportersService {
	constructor(
		@InjectRepository(Transporter)
		private readonly transportersRepository: Repository<Transporter>,
	) { }

	async create(transporterCreateDto: TransporterCreateDto): Promise<Transporter> {
		const transporter = this.transportersRepository.create(transporterCreateDto);
		return await this.transportersRepository.save(transporter);
	}

	async update(id: number, transporterUpdateDto: TransporterUpdateDto): Promise<Transporter> {
		const transporter = await this.transportersRepository.findOne({ where: { id } });
		if (!transporter) {
			throw new BusinessException('Transportador no encontrado', 400);
		}
		Object.assign(transporter, transporterUpdateDto);
		return await this.transportersRepository.save(transporter);
	}

	async findAll({
		page,
		pageSize,
		name
	}: TransporterQueryDto): Promise<Pagination<Transporter>> {
		const queryBuilder = this.transportersRepository
			.createQueryBuilder('transportador')
			.where({
				...(name ? { name: Like(`%${name}%`) } : null),
			});

		return paginate<Transporter>(queryBuilder, {
			page,
			pageSize,
		});
	}

	async findOne(id: number): Promise<Transporter> {
		const transporter = await this.transportersRepository.findOne({ where: { id } });
		if (!transporter) {
			throw new BusinessException('Transportador no encontrado', 400);
		}
		return transporter;
	}

	async changeStatus(id: number, status: boolean): Promise<Transporter> {
		const transporter = await this.findOne(id);
		transporter.status = status;
		return await this.transportersRepository.save(transporter);
	}

	async remove(id: number): Promise<void> {
		const transporter = await this.findOne(id);
		await this.transportersRepository.remove(transporter);
	}
}
