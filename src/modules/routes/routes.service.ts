import { Injectable } from '@nestjs/common';
import { CreateRouteDto, UpdateRouteDto } from './dto/route.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { Repository } from 'typeorm';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';

@Injectable()
export class RoutesService {
	constructor(
		@InjectRepository(Route)
		private readonly repository: Repository<Route>,
	) { }

	async create(dto: CreateRouteDto): Promise<Route> {
		const entity = this.repository.create(dto);
		return await this.repository.save(entity);
	}

	async findOne(id: number): Promise<Route> {
		const entity = await this.repository.findOne({ where: { id } });
		if (!entity) {
			throw new BusinessException('Ruta no encontrada');
		}
		return entity;
	}

	async update(id: number, dto: UpdateRouteDto): Promise<Route> {
		const entity = await this.repository.preload({
			id,
			...dto,
		});

		if (!entity) {
			throw new BusinessException('Ruta no encontrada');
		}

		return await this.repository.save(entity);
	}

	async findAll(query): Promise<Route[]> {
		return await this.repository.find({
			where: query,
		});
	}

	async remove(id: number): Promise<void> {
		const result = await this.repository.delete(id);
		if (result.affected === 0) {
			throw new BusinessException('Ruta no encontrada');
		}
	}
}
