import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transporter } from './entities/transporter.entity';
import { Like, Repository } from 'typeorm';
import { TransporterCreateDto, TransporterQueryDto, TransporterUpdateDto } from './dto/transporter.dto';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { UserContextService } from '../users/user-context.service';

@Injectable()
export class TransportersService {
	constructor(
		@InjectRepository(Transporter)
		private readonly transportersRepository: Repository<Transporter>,
		private readonly userContextService: UserContextService
	) { }

	async create(transporterCreateDto: TransporterCreateDto): Promise<Transporter> {
		const user_id = this.userContextService.getUserDetails().id;

		const transporter = this.transportersRepository.create({ ...transporterCreateDto, createdBy: user_id, modifiedBy: user_id });
		return await this.transportersRepository.save(transporter);
	}

	async update(id: number, updatedData: TransporterUpdateDto): Promise<Transporter> {
		const transporter = await this.transportersRepository.findOne({ where: { id } });

		if (!transporter) {
			throw new BusinessException('Transportador no encontrado', 400);
		}

		updatedData = Object.assign(transporter, updatedData);
		const modifiedBy = this.userContextService.getUserDetails().id;

		return await this.transportersRepository.save({ ...updatedData, modifiedBy });
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

	async changeStatus(id: number): Promise<Transporter> {
		const transporter = await this.findOne(id);
		transporter.status = !transporter.status;

		const modifiedBy = this.userContextService.getUserDetails().id;

		return await this.transportersRepository.save({ ...transporter, modifiedBy });
	}

	async remove(id: number): Promise<void> {
		const transporter = await this.findOne(id);
		await this.transportersRepository.remove(transporter);
	}
}
