import { Injectable } from '@nestjs/common';
import { ReportQueryDto, ReportResponseDto } from './dto/report.dto';
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

	async getBatteryRecyclingByDate({ startDate, endDate, agencyId }: ReportQueryDto): Promise<ReportResponseDto[]> {
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
}
