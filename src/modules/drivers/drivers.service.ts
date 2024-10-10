import { Injectable } from '@nestjs/common';
import { DriverDto, DriverUpdateDto } from './dto/driver.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { EntityManager, Repository } from 'typeorm';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { UserContextService } from '../users/user-context.service';
import { CollectionRequest } from '../collection_request/entities/collection_request.entity';

@Injectable()
export class DriversService {

	constructor(
		@InjectRepository(Driver)
		private readonly driverRepository: Repository<Driver>,
		@InjectRepository(CollectionRequest)
		private readonly collectionRequestRepository: Repository<CollectionRequest>,
		@InjectEntityManager() private entityManager: EntityManager,
		private userContextService: UserContextService
	) { }

	async create({ collectionRequestId: id, cellphone, ...content }: DriverDto): Promise<Driver> {
		const collectionRequest = await this.collectionRequestRepository.findOneBy({ id });

		if (!collectionRequest) {
			throw new BusinessException('La solicitud de recogida no existe.');
		}

		const user_id = this.userContextService.getUserDetails().id;

		const driver = this.driverRepository.create({ collectionRequest, ...content, createdBy: user_id, modifiedBy: user_id, cellphone: String(cellphone) });
		const driverSaved = await this.driverRepository.save(driver);
		return driverSaved;
	}

	async update(_id, { collectionRequestId: id, cellphone, ...updatedData }: DriverUpdateDto): Promise<any> {
		const driver = await this.driverRepository.findOneBy({ id: _id });

		if (!driver) {
			throw new BusinessException('El conductor no existe.');
		}

		const collectionRequest = await this.collectionRequestRepository.findOneBy({ id });

		if (!collectionRequest) {
			throw new BusinessException('La solicitud de recogida no existe.');
		}

		const user_id = this.userContextService.getUserDetails().id;

		updatedData = Object.assign(driver, updatedData);

		const updateDriver = await this.driverRepository.update(id, { ...updatedData, collectionRequest, modifiedBy: user_id, cellphone: String(cellphone) });

		return updateDriver;
	}
}
