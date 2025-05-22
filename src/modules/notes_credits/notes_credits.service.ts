import { Injectable } from '@nestjs/common';
import { NotesCredit } from './entities/notes_credit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserContextService } from '../users/user-context.service';
import { AuditRoute } from '../audit_route/entities/audit_route.entity';
import { AUDIT_ROUTE_STATUS, NOTE_CREDIT_STATUS } from 'src/core/constants/status.constant';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';

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
		const auditRoute = await this.auditRouteRepository.findOne({ where: { id }, relations: ['auditRouteDetails'] });

		if (auditRoute.requestStatusId !== AUDIT_ROUTE_STATUS.CONFIRMED) {
			throw new BusinessException('La auditoria de ruta no aplica para la acción a ejecutar', 400);
		}

		const createdBy = this.userContextService.getUserId();

		for (const element of auditRoute.auditRouteDetails) {
			const item = this.noteCreditRepository.create({
				auditRoute,
				requestStatusId: NOTE_CREDIT_STATUS.PENDING,
				product: element.product,
				quantity: element.quantityConciliated,
				guideId: element.guideId,
				createdBy,
				modifiedBy: createdBy,
			})

			await this.noteCreditRepository.save(item);
		}
	}

	async findAll(): Promise<NotesCredit[]> {
		const query = this.noteCreditRepository.createQueryBuilder('notesCredit')
			.leftJoinAndSelect('notesCredit.auditRoute', 'auditRoute')
			.leftJoinAndSelect('notesCredit.product', 'product')
			.andWhere('notesCredit.requestStatusId = :requestStatusId', { requestStatusId: NOTE_CREDIT_STATUS.PENDING })
			.orderBy('notesCredit.createdAt', 'DESC');

		return await query.getMany();
	}
}
