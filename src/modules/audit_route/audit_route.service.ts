import { Injectable } from '@nestjs/common';
import { ListAuditRouteDto } from './dto/audit_route.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TransporterTravel } from '../transporter_travel/entities/transporter_travel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuditRouteService {

	constructor(
		@InjectRepository(TransporterTravel)
		private readonly transporterTravelRepository: Repository<TransporterTravel>,
	) { }

	async findAll(): Promise<ListAuditRouteDto[]> {
		const transporterTravels = await this.transporterTravelRepository
			.createQueryBuilder('transporterTravel')
			.leftJoinAndSelect('transporterTravel.auditRoutes', 'auditRoute')
			.where('auditRoute.id IS NULL')
			.getMany();

		return transporterTravels.map((transporterTravel) => ({
			origin: 'VIAJE TRANSPORTADORA',
			transporter: null,
			routeId: transporterTravel.routeId,
			zone: transporterTravel.zone,
			date: transporterTravel.movementDate,
			recuperator: null,
			quantityTotal: transporterTravel.totalQuantity,
			gap: null,
			status: 'EN TRANSITO',
		}));
	}
}
