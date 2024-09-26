import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Consultant } from './entities/consultant.entity';
import { Like, Repository } from 'typeorm';
import { ConsultantCreateDto, ConsultantQueryDto, ConsultantUpdateDto } from './dto/consultant.dto';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { UserContextService } from '../users/user-context.service';

@Injectable()
export class ConsultantsService {
	constructor(
		@InjectRepository(Consultant)
		private readonly consultantsRepository: Repository<Consultant>,
		private readonly userContextService: UserContextService
	) { }

	async create(consultantCreateDto: ConsultantCreateDto): Promise<Consultant> {
		const user_id = this.userContextService.getUserDetails().id;

		const consultant = this.consultantsRepository.create({ ...consultantCreateDto, createdBy: user_id, modifiedBy: user_id });
		return await this.consultantsRepository.save(consultant);
	}

	async update(id: number, updatedData: ConsultantUpdateDto): Promise<Consultant> {
		const consultant = await this.consultantsRepository.findOne({ where: { id } });

		if (!consultant) {
			throw new BusinessException('Asesor no encontrado', 400);
		}

		updatedData = Object.assign(consultant, updatedData);
		const modifiedBy = this.userContextService.getUserDetails().id;

		return await this.consultantsRepository.save({ ...updatedData, modifiedBy });
	}

	async findAll({
		page,
		pageSize,
		name
	}: ConsultantQueryDto): Promise<Pagination<Consultant>> {
		const queryBuilder = this.consultantsRepository
			.createQueryBuilder('asesor')
			.where({
				...(name ? { name: Like(`%${name}%`) } : null),
			});

		return paginate<Consultant>(queryBuilder, {
			page,
			pageSize,
		});
	}

	async findOne(id: number): Promise<Consultant> {
		const consultant = await this.consultantsRepository.findOne({ where: { id } });
		if (!consultant) {
			throw new BusinessException('Asesor no encontrado', 400);
		}
		return consultant;
	}

	async changeStatus(id: number): Promise<Consultant> {
		const consultant = await this.findOne(id);
		consultant.status = !consultant.status;

		const modifiedBy = this.userContextService.getUserDetails().id;

		return await this.consultantsRepository.save({ ...consultant, modifiedBy });
	}

	async remove(id: number): Promise<void> {
		const consultant = await this.findOne(id);
		await this.consultantsRepository.remove(consultant);
	}

}
