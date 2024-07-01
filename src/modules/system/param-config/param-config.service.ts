import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/core/constants/error-code.constant';
import { paginate } from 'src/core/helper/paginate';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { ParamConfigEntity } from 'src/modules/system/param-config/param-config.entity';

import { ParamConfigDto, ParamConfigQueryDto } from './param-config.dto';

@Injectable()
export class ParamConfigService {
	constructor(
		@InjectRepository(ParamConfigEntity)
		private paramConfigRepository: Repository<ParamConfigEntity>,
	) {}

	/**
	 * Paginar y listar todas las configuraciones
	 */
	async page({
		page,
		pageSize,
		name,
	}: ParamConfigQueryDto): Promise<Pagination<ParamConfigEntity>> {
		const queryBuilder =
			this.paramConfigRepository.createQueryBuilder('config');

		if (name) {
			queryBuilder.where('config.name LIKE :name', {
				name: `%${name}%`,
			});
		}

		return paginate(queryBuilder, { page, pageSize });
	}

	/**
	 * Obtener el número total de configuraciones
	 */
	async countConfigList(): Promise<number> {
		return this.paramConfigRepository.count();
	}

	/**
	 * Crear una nueva configuración
	 */
	async create(dto: ParamConfigDto): Promise<void> {
		await this.paramConfigRepository.insert(dto);
	}

	/**
	 * Actualizar una configuración existente
	 */
	async update(id: string, dto: Partial<ParamConfigDto>): Promise<void> {
		await this.paramConfigRepository.update(id, dto);
	}

	/**
	 * Eliminar una configuración por su ID
	 */
	async delete(id: string): Promise<void> {
		await this.paramConfigRepository.delete(id);
	}

	/**
	 * Buscar una configuración por su ID
	 */
	async findOne(id: string): Promise<ParamConfigEntity> {
		return this.paramConfigRepository.findOneBy({ id });
	}

	/**
	 * Verificar si ya existe una configuración con la misma clave
	 */
	async isExistKey(key: string): Promise<void | never> {
		const result = await this.paramConfigRepository.findOneBy({ key });
		if (result)
			throw new BusinessException(ErrorEnum.PARAMETER_CONFIG_KEY_EXISTS);
	}

	/**
	 * Buscar el valor de una configuración por su clave
	 */
	async findValueByKey(key: string): Promise<string | null> {
		const result = await this.paramConfigRepository.findOne({
			where: { key },
			select: ['value'],
		});
		if (result) return result.value;

		return null;
	}
}
