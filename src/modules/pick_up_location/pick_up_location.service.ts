import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PickUpLocation } from './entities/pick_up_location.entity';
import { PickUpLocationCreateDto, PickUpLocationUpdateDto, PickUpLocationQueryDto } from './dto/pick_up_location.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { UserContextService } from '../users/user-context.service';
import { ClientsService } from '../clients/clients.service';
import { CollectionSitesService } from '../collection_sites/collection_sites.service';
import { UsersService } from '../users/users.service';
import { Child } from '../catalogs/entities/child.entity';

@Injectable()
export class PickUpLocationsService {
	constructor(
		@InjectRepository(PickUpLocation)
		private readonly pickUpLocationsRepository: Repository<PickUpLocation>,
		private readonly userContextService: UserContextService,
		private readonly clientsService: ClientsService,
		private readonly collectionSitesService: CollectionSitesService,
		private readonly usersSitesService: UsersService,
		@InjectRepository(Child)
		private readonly childsRepository: Repository<Child>,
	) { }

	async create({ clientId, collectionSiteId, consultantId, ...content }: PickUpLocationCreateDto): Promise<PickUpLocation> {
		const user_id = this.userContextService.getUserDetails().id;

		const client = await this.clientsService.findOne(clientId);

		if (!client) {
			throw new BusinessException('Cliente no encontrado', 400);
		}

		const collectionSite = await this.collectionSitesService.findOne(collectionSiteId);

		if (!collectionSite) {
			throw new BusinessException('Sede de acopio no encontrado', 400);
		}

		const user = await this.usersSitesService.findUserById(consultantId.toString());

		if (!user) {
			throw new BusinessException('Asesor no encontrado', 400);
		}

		const truckType = await this.childsRepository.findOne({ where: { status: true, id: content.truckTypeId, catalogCode: 'TIPO_CAMION_SUGERIDO' }});

		if (!truckType) {
			throw new BusinessException('El tipo de camión no existe o no está configurado', 400);
		}

		const pickUpLocation = this.pickUpLocationsRepository.create({ ...content, client, collectionSite, user, createdBy: user_id, modifiedBy: user_id });
		return await this.pickUpLocationsRepository.save(pickUpLocation);
	}

	async update(id: number, updatedData: PickUpLocationUpdateDto): Promise<PickUpLocation> {
		const pickUpLocation = await this.pickUpLocationsRepository.findOne({ where: { id } });

		if (!pickUpLocation) {
			throw new BusinessException('Lugar de recogida no encontrado', 400);
		}

		if (updatedData.clientId) {
			const client = await this.clientsService.findOne(updatedData.clientId);

			if (!client) {
				throw new BusinessException('Cliente no encontrado', 400);
			}

			pickUpLocation.client = client;
		}

		if (updatedData.collectionSiteId) {
			const collectionSite = await this.collectionSitesService.findOne(updatedData.collectionSiteId);

			if (!collectionSite) {
				throw new BusinessException('Sede de acopio no encontrado', 400);
			}
			pickUpLocation.collectionSite = collectionSite;
		}

		if (updatedData.truckTypeId) {
			const truckType = await this.childsRepository.findOne({ where: { status: true, id: updatedData.truckTypeId, catalogCode: 'TIPO_CAMION_SUGERIDO' }});

			if (!truckType) {
				throw new BusinessException('El tipo de camión no existe o no está configurado', 400);
			}
		}

		updatedData = Object.assign(pickUpLocation, updatedData);
		const modifiedBy = this.userContextService.getUserDetails().id;

		return await this.pickUpLocationsRepository.save({ ...updatedData, modifiedBy });
	}

	async findAll({ page, pageSize, clientId, placeTypeId }: PickUpLocationQueryDto): Promise<Pagination<PickUpLocation>> {
		const queryBuilder = this.pickUpLocationsRepository
			.createQueryBuilder('pick_up_locations')
			.leftJoinAndSelect('pick_up_locations.client', 'client')
			.leftJoinAndSelect('pick_up_locations.collectionSite', 'collectionSite')
			.leftJoinAndSelect('pick_up_locations.user', 'consultant')
			.leftJoinAndSelect('pick_up_locations.collectionsRequests', 'collectionsRequests')
			.leftJoinAndMapOne('pick_up_locations.city', Child, 'city', 'city.id = pick_up_locations.cityId')
			.leftJoinAndMapOne('pick_up_locations.truckType', Child, 'truckType', 'truckType.id = pick_up_locations.truckTypeId')

		if (clientId) {
			queryBuilder.andWhere('client.id = :clientId', { clientId });
		}

		queryBuilder.orderBy('pick_up_locations.name', 'ASC')

		let { items, meta } = await paginate<PickUpLocation>(queryBuilder, { page, pageSize });

		items = items.map((element: any) => ({ ...element, citiyName: element.cityId.name }));

		return { items, meta };
	}

	async findOne(id: number): Promise<PickUpLocation> {
		const queryBuilder = this.pickUpLocationsRepository
			.createQueryBuilder('pick_up_locations')
			.leftJoinAndSelect('pick_up_locations.client', 'client')
			.leftJoinAndSelect('pick_up_locations.collectionSite', 'collectionSite')
			.leftJoinAndSelect('pick_up_locations.user', 'consultant')
			.leftJoinAndSelect('pick_up_locations.collectionsRequests', 'collectionsRequests')
			.leftJoinAndMapOne('pick_up_locations.truckType', Child, 'truckType', 'truckType.id = pick_up_locations.truckTypeId')

			.where('pick_up_locations.id = :id', { id });

		const pickUpLocation = await queryBuilder.getOne();

		if (!pickUpLocation) {
			throw new BusinessException('Lugar de recogida no encontrado', 400);
		}

		return pickUpLocation;
	}


	async changeStatus(id: number): Promise<PickUpLocation> {
		const pickUpLocation = await this.findOne(id);
		pickUpLocation.status = !pickUpLocation.status;

		const modifiedBy = this.userContextService.getUserDetails().id;

		return await this.pickUpLocationsRepository.save({ ...pickUpLocation, modifiedBy });
	}

	async remove(id: number): Promise<void> {
		const pickUpLocation = await this.findOne(id);
		await this.pickUpLocationsRepository.remove(pickUpLocation);
	}
}
