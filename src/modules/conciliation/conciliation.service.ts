import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransporterTravel } from '../transporter_travel/entities/transporter_travel.entity';
import { Repository } from 'typeorm';
import { Child } from '../catalogs/entities/child.entity';
import { Reception } from '../receptions/entities/reception.entity';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { ListConciliationDto } from './dto/conciliation.dto';
import { paginate } from 'src/core/helper/paginate';

@Injectable()
export class ConciliationService {

	constructor(
		@InjectRepository(TransporterTravel)
		private readonly transporterTravelRepository: Repository<TransporterTravel>,
		@InjectRepository(Reception)
		private readonly receptionsRepository: Repository<Reception>,
		@InjectRepository(Child)
		private readonly childrensRepository: Repository<Child>,
	) {}

	async findAll(): Promise<ListConciliationDto[]> {
		// const transporterTravels = this.transporterTravelRepository.find({
		// 	where: { status: true },
		// 	relations: ['reception', 'reception.collectionSite', 'reception.transporter'],
		// });
		return [];

		// return (await transporterTravels).map((element) => ({
		// 	transporter: element.driver,
		// 	id: element.id,
		// 	route: element.auditRoutes,
		// 	zone: element.zone,
		// 	recuperator: '',
		// 	totalQuantity: 0,
		// 	status: '',
		// }));
	}
}
