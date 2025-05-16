import { Injectable } from '@nestjs/common';
import { ReportQueryDto } from './dto/report.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class ReportsService {
	constructor(
		@InjectEntityManager() private readonly entityManager: EntityManager
	) { }

	async getBatteryRecyclingByDate({ startDate, endDate }: ReportQueryDto) {
		// Consulta directa a la tabla usuario
		const usuarios = await this.entityManager.query('SELECT * FROM usuario');
		console.log('Usuarios:', usuarios);
		return usuarios;
	}
}
