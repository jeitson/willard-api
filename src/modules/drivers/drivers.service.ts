import { Injectable } from '@nestjs/common';
import { DriverDto } from './dto/driver.dto';
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

	async create({ collectionRequestId: id, ...content }: DriverDto): Promise<void> {
		const collectionRequest = await this.collectionRequestRepository.findOneBy({ id });

		if (!collectionRequest) {
			throw new BusinessException('La solicitud de recogida no existe.');
		}

		await this.entityManager.transaction(async (manager) => {
			const user_id = this.userContextService.getUserDetails().id;

			const driver = manager.create(Driver, {
				collectionRequest,
				...content,
				createdBy: user_id,
				modifiedBy: user_id,
			});

			await manager.save(driver);
		});
	}

	async update(_id, { collectionRequestId: id, ...updatedData }: DriverDto): Promise<void> {
		const driver = await this.driverRepository.findOneBy({ id: _id });

		if (!driver) {
			throw new BusinessException('El conductor no existe.');
		}

		const collectionRequest = await this.collectionRequestRepository.findOneBy({ id });

		if (!collectionRequest) {
			throw new BusinessException('La solicitud de recogida no existe.');
		}

		await this.entityManager.transaction(async (manager) => {
			const user_id = this.userContextService.getUserDetails().id;

			updatedData = Object.assign(driver, updatedData);

			await manager.update(Driver, id, { ...updatedData, collectionRequest, modifiedBy: user_id });
		});
	}
}
