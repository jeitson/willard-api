import { Injectable } from '@nestjs/common';
import { NotesCredit } from './entities/notes_credit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserContextService } from '../users/user-context.service';
import { AuditRoute } from '../audit_route/entities/audit_route.entity';
import { AUDIT_ROUTE_STATUS, NOTE_CREDIT_STATUS } from 'src/core/constants/status.constant';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { NotesCreditQueryDto, NotesCreditResponseDto } from './dto/notes_credits.dto';

@Injectable()
export class NotesCreditsService {

	constructor(
		@InjectRepository(AuditRoute)
		private readonly auditRouteRepository: Repository<AuditRoute>,
		@InjectRepository(NotesCredit)
		private readonly noteCreditRepository: Repository<NotesCredit>,
		private userContextService: UserContextService,
	) { }

	async create(id: number): Promise<void> {
		const auditRoute = await this.auditRouteRepository.findOne({ where: { id }, relations: ['auditRouteDetails', 'auditRouteDetails.product'] });

		if (+auditRoute.requestStatusId !== AUDIT_ROUTE_STATUS.CONFIRMED) {
			throw new BusinessException('La auditoría de ruta no aplica para la acción a ejecutar', 400);
		}

		const createdBy = this.userContextService.getUserDetails()?.id;

		for (const element of auditRoute.auditRouteDetails) {
			if (element.quantityConciliated - element.quantity < 0) {
				const item = this.noteCreditRepository.create({
					auditRoute,
					requestStatusId: NOTE_CREDIT_STATUS.PENDING,
					product: element.product,
					quantity: element.quantity - element.quantityConciliated,
					guideId: element.guideId,
					createdBy,
					modifiedBy: createdBy,
				})

				await this.noteCreditRepository.save(item);
			}
		}
	}

	async findAll({ transporterId }: NotesCreditQueryDto): Promise<NotesCreditResponseDto[]> {
		const result = await this.noteCreditRepository.query(`
			SELECT
	nc."AuditoriaRutaId" AS auditRouteId
	,t."Id" AS transporterId
	,d."Transportadora" AS transporter
	,nc."GuiaId" AS guide
	,e."Factura" AS invoice
	,JSON_AGG(
		JSON_BUILD_OBJECT(
			'name', p."Nombre"
			,'quantity', nc."Cantidad"
		)
	) AS batteries_pending
FROM nota_credito nc
INNER JOIN documento d ON d."Guia" = nc."GuiaId"
INNER JOIN transportadora t ON UPPER(t."Nombre") = UPPER(d."Transportadora")
INNER JOIN erc e ON e."DocumentoRadicado" = d."Id"
INNER JOIN producto p ON p."Id" = nc."ProductoId"
WHERE t."Id" = $1
GROUP BY nc."AuditoriaRutaId", t."Id",  d."Transportadora", nc."GuiaId", e."Factura"
		`, [transporterId]);
		return result;
	}

	async confirm(id: number): Promise<void> {
		const notesCredit = await this.noteCreditRepository.find({
			where: { auditRoute: { id }, requestStatusId: NOTE_CREDIT_STATUS.PENDING },
		});

		if (!notesCredit.length) {
			throw new BusinessException(
				'No hay registros con la configuración ingresada, o no aplican para cambio de estado'
			);
		}

		await Promise.all(
			notesCredit.map(note =>
				this.noteCreditRepository.update(note.id, {
					requestStatusId: NOTE_CREDIT_STATUS.CONFIRMED,
				})
			)
		);
	}
}
