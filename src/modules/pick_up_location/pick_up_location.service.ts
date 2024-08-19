import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PickUpLocation } from './entities/pick_up_location.entity';
import { PickUpLocationCreateDto, PickUpLocationUpdateDto, PickUpLocationQueryDto } from './dto/pick_up_location.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';

@Injectable()
export class PickUpLocationsService {
	constructor(
		@InjectRepository(PickUpLocation)
		private readonly pickUpLocationsRepository: Repository<PickUpLocation>,
	) { }

	async create(createPickUpLocationDto: PickUpLocationCreateDto): Promise<PickUpLocation> {
		const pickUpLocation = this.pickUpLocationsRepository.create(createPickUpLocationDto);
		return await this.pickUpLocationsRepository.save(pickUpLocation);
	}

	async update(id: number, updatePickUpLocationDto: PickUpLocationUpdateDto): Promise<PickUpLocation> {
		const pickUpLocation = await this.pickUpLocationsRepository.findOne({ where: { id } });
		if (!pickUpLocation) {
			throw new BusinessException('Lugar de recogida no encontrado', 400);
		}
		Object.assign(pickUpLocation, updatePickUpLocationDto);
		return await this.pickUpLocationsRepository.save(pickUpLocation);
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

	async changeStatus(id: number, status: boolean): Promise<PickUpLocation> {
		const pickUpLocation = await this.findOne(id);
		pickUpLocation.status = status;
		return await this.pickUpLocationsRepository.save(pickUpLocation);
	}

	async remove(id: number): Promise<void> {
		const pickUpLocation = await this.findOne(id);
		await this.pickUpLocationsRepository.remove(pickUpLocation);
	}
}
