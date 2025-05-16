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
		const start = new Date(startDate).toISOString().split('T')[0];
		const end = new Date(endDate).toISOString().split('T')[0];

		return await this.entityManager.query(
			`SELECT * FROM erc
     WHERE fechacreacion >= $1
       AND fechacreacion < $2`,
			[start, end]
		);
	}
}
