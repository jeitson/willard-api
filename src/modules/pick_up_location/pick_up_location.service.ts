import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PickUpLocation } from './entities/pick_up_location.entity';
import { PickUpLocationCreateDto, PickUpLocationUpdateDto, PickUpLocationQueryDto } from './dto/pick_up_location.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { UserContextService } from '../users/user-context.service';

@Injectable()
export class PickUpLocationsService {
	constructor(
		@InjectRepository(PickUpLocation)
		private readonly pickUpLocationsRepository: Repository<PickUpLocation>,
		private readonly userContextService: UserContextService
	) { }

	async create(createPickUpLocationDto: PickUpLocationCreateDto): Promise<PickUpLocation> {
		const user_id = this.userContextService.getUserDetails().id;

		const pickUpLocation = this.pickUpLocationsRepository.create({ ...createPickUpLocationDto, createdBy: user_id, modifiedBy: user_id });
		return await this.pickUpLocationsRepository.save(pickUpLocation);
	}

	async update(id: number, updatedData: PickUpLocationUpdateDto): Promise<PickUpLocation> {
		const pickUpLocation = await this.pickUpLocationsRepository.findOne({ where: { id } });

		if (!pickUpLocation) {
			throw new BusinessException('Lugar de recogida no encontrado', 400);
		}

		updatedData = Object.assign(pickUpLocation, updatedData);
		const modifiedBy = this.userContextService.getUserDetails().id;

		return await this.pickUpLocationsRepository.save({ ...updatedData, modifiedBy });
	}

	async findAll(query: PickUpLocationQueryDto): Promise<Pagination<PickUpLocation>> {
		const { page, pageSize, } = query;
		const queryBuilder = this.pickUpLocationsRepository
			.createQueryBuilder('lugar_recogida')
		//   .where({
		//     ...(name ? { name: Like(`%${name}%`) } : null),
		//   });

		return paginate<PickUpLocation>(queryBuilder, { page, pageSize });
	}

	async findOne(id: number): Promise<PickUpLocation> {
		const pickUpLocation = await this.pickUpLocationsRepository.findOne({ where: { id } });
		if (!pickUpLocation) {
			throw new BusinessException('Lugar de recogida no encontrado', 400);
		}
		return pickUpLocation;
	}

	async changeStatus(id: number): Promise<PickUpLocation> {
		const pickUpLocation = await this.findOne(id);
		pickUpLocation.status = !pickUpLocation.status;

		const modifiedBy = this.userContextService.getUserDetails().id;

		return await this.pickUpLocationsRepository.save({ ...pickUpLocation, modifiedBy });
	}

	async remove(id: number): Promise<void> {
		const pickUpLocation = await this.findOne(id);
		await this.pickUpLocationsRepository.remove(pickUpLocation);
	}
}
