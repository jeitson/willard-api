import { Injectable } from '@nestjs/common';
import { HistoryJobDto, HistoryJobQueryDto } from './dto/history_job.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { HistoryJob } from './entities/history_job.entity';
import { EntityManager, Like, Repository } from 'typeorm';
import { paginate } from 'src/core/helper/paginate';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class HistoryJobsService {
	constructor(
		@InjectRepository(HistoryJob)
		private readonly historyJobRepository: Repository<HistoryJob>,
		@InjectEntityManager() private entityManager: EntityManager,
	) { }

	/**
	 * Crea un nuevo registro en el historial de trabajos.
	 *
	 * @param {HistoryJobDto} content - Datos del trabajo a registrar.
	 * @returns {Promise<void>}
	 */
	async create({
		inputContent,
		outputContent,
		...content
	}: HistoryJobDto): Promise<void> {
		await this.entityManager.transaction(async (manager) => {
			const r = manager.create(HistoryJob, {
				inputContent: JSON.stringify(inputContent),
				outputContent: JSON.stringify(outputContent),
				modifiedBy: content.creatorBy ? content.creatorBy : null,
				...content,
			});

			await manager.save(r);
		});
	}

	/**
	 * Obtiene la fecha de la última sincronización exitosa para una clave específica.
	 *
	 * @param {string} key - Clave del proceso (por ejemplo, 'SYNC:CLIENT').
	 * @returns {Promise<Date | null>} - Fecha de la última sincronización exitosa, o null si no hay registros.
	 */
	async getLastSuccessSync(key: string): Promise<Date | null> {
		const lastSync = await this.historyJobRepository.findOne({
			where: {
				key,
				statusProcess: 'SUCCESS',
			},
			order: {
				createdAt: 'DESC',
			},
		});

		return lastSync ? lastSync.createdAt : null;
	}

	/**
	 * Obtiene la fecha de la última sincronización fallida para una clave específica.
	 *
	 * @param {string} key - Clave del proceso (por ejemplo, 'SYNC:CLIENT').
	 * @returns {Promise<Date | null>} - Fecha de la última sincronización fallida, o null si no hay registros.
	 */
	async getLastFailedSync(key: string): Promise<Date | null> {
		const lastSync = await this.historyJobRepository.findOne({
			where: {
				key,
				statusProcess: 'FAILED',
			},
			order: {
				createdAt: 'DESC',
			},
		});

		return lastSync ? lastSync.createdAt : null;
	}

	/**
	 * Obtiene todos los registros del historial de trabajos.
	 *
	 * @param {HistoryJobQueryDto} query - Parámetros de consulta.
	 * @returns {Promise<Pagination<HistoryJob>>} - Resultados paginados.
	 */
	async findAll({
		page,
		pageSize,
		name,
		key,
		createdBy
	}: HistoryJobQueryDto): Promise<Pagination<HistoryJob>> {
		const queryBuilder = this.historyJobRepository
			.createQueryBuilder('history_process')
			.where({
				...(name ? { name: Like(`%${name}%`) } : null),
				...(key ? { key: Like(`%${key}%`) } : null),
			});

		if (createdBy) {
			queryBuilder.andWhere('history_process.createdBy = :createdBy', { createdBy });
		}

		const paginatedResult: any = await paginate<HistoryJob>(queryBuilder, {
			page,
			pageSize,
		});

		paginatedResult.items = paginatedResult.items.map((item) => {
			return {
				...item,
				inputContent: item.inputContent ? JSON.parse(item.inputContent) : [],
				outputContent: item.outputContent ? JSON.parse(item.outputContent) : [],
			};
		});

		return paginatedResult;
	}

	/**
	 * Obtiene un registro del historial de trabajos por su ID.
	 *
	 * @param {number} id - ID del registro.
	 * @returns {Promise<HistoryJob | undefined>} - Registro del historial.
	 */
	async findOneById(id: number): Promise<HistoryJob | undefined> {
		const item = await this.historyJobRepository.findOneBy({
			id,
		});

		item.inputContent = item.inputContent ? JSON.parse(item.inputContent) : [];
		item.outputContent = item.outputContent ? JSON.parse(item.outputContent) : [];

		return item;
	}
}
