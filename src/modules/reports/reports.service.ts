import { Injectable } from '@nestjs/common';
import { ReportQueryDto, ReportResponseDto } from './dto/report.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Erc } from 'src/core/entities/erc.entity';
import { HistoryJobsService } from '../history_jobs/history_jobs.service';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { UserContextService } from '../users/user-context.service';

@Injectable()
export class ReportsService {
	constructor(
		@InjectRepository(Erc)
		private readonly ercRepository: Repository<Erc>,
		@InjectEntityManager() private readonly entityManager: EntityManager,
		private readonly historyJobsService: HistoryJobsService,
		private readonly userContextService: UserContextService,
	) { }

	async getBatteryRecyclingByDate({ startDate, endDate, agencyId }: ReportQueryDto): Promise<ReportResponseDto[]> {
		const createdBy = this.userContextService.getUserId();

		const existing = await this.historyJobsService.findAll({
			key: 'QUERY::REPORT_BATTERY_RECYCLING',
			name: 'Consulta de reciclaje de baterías',
			createdBy
		});

		const blocked = existing.items.filter(item => {
			const input = Array.isArray(item.inputContent) ? item.inputContent : JSON.parse(item.inputContent);
			return input.some(
				(i: any) =>
					i.startDate === startDate &&
					i.endDate === endDate &&
					i.agencyId === agencyId
			);
		});

		if (blocked.length > 0) {
			throw new BusinessException('Ya se consultaron estas fechas');
		}

		const result = await this.entityManager.query(`
			SELECT
				e."Id" AS id,
				e."Fecha" AS delivery_date,
				SUM(it."Cantidad") AS quantity_batteries,
				JSON_AGG(
					JSON_BUILD_OBJECT(
						'name', p."Nombre",
						'quantity', it."Cantidad",
						'unity', ch."Nombre"
					)
				) AS materials
			FROM erc e
			INNER JOIN sedes_acopio sa ON sa."ReferenciaPH" = e."Agencia"
			INNER JOIN irc i ON i."ErcIdRef" = e."Id"
			INNER JOIN item it ON it."IrcIdRef" = i."Id"
			INNER JOIN producto p ON p."ReferenciaPH" = it."Referencia"
			INNER JOIN catalogo_hijo ch ON ch."Id" = p."UnidadMedidaId"
			WHERE e."Fecha" >= $1 AND e."Fecha" <= $2
			AND sa."Id" = $3
			GROUP BY e."Id", e."Fecha"
		`, [startDate, endDate, agencyId]);

		return result;
	}

	async generate({ startDate, endDate, agencyId }: ReportQueryDto): Promise<void> {
		const creatorBy = this.userContextService.getUserId();

		// Guardar registro en HistoryJob
		await this.historyJobsService.create({
			key: 'QUERY::REPORT_BATTERY_RECYCLING',
			name: 'Consulta de reciclaje de baterías',
			description: `Consulta de reciclaje de baterías para fechas ${startDate} a ${endDate} y agencia ${agencyId}`,
			inputContent: [{ startDate, endDate, agencyId }],
			outputContent: [],
			statusProcess: 'SUCCESS',
			creatorBy
		});
	}
}
