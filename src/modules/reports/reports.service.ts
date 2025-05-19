import { Injectable } from '@nestjs/common';
import { ReportQueryDto } from './dto/report.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Erc } from 'src/core/entities/erc.entity';

@Injectable()
export class ReportsService {
	constructor(
		@InjectRepository(Erc)
		private readonly ercRepository: Repository<Erc>,
		@InjectEntityManager() private readonly entityManager: EntityManager
	) { }

	async getBatteryRecyclingByDate({ startDate, endDate }: ReportQueryDto): Promise<Erc[]> {
		const start = new Date(startDate).toISOString().split('T')[0];
		const end = new Date(endDate).toISOString().split('T')[0];

		return this.ercRepository.createQueryBuilder('erc')
			.where('erc.createdAt >= :start', { start })
			.andWhere('erc.createdAt <= :end', { end })
			.getMany();

		// 	return await this.entityManager.query(
		// 		`SELECT * FROM erc
		//  WHERE fechacreacion >= $1
		//    AND fechacreacion < $2`,
		// 		[start, end]
		// 	);
	}
}
