import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { BusinessException } from "src/core/common/exceptions/biz.exception";
import { Pagination } from "src/core/helper/paginate/pagination";
import { paginate } from "src/core/helper/paginate";
import { CollectionRequest } from "./entities/collection_request.entity";
import { CollectionRequestCreateDto, CollectionRequestUpdateDto } from "./dto/collection_request.dto";

@Injectable()
export class CollectionRequestService {
	constructor(
		@InjectRepository(CollectionRequest)
		private readonly collectionRequestRepository: Repository<CollectionRequest>,
	) { }

	async create(createDto: CollectionRequestCreateDto): Promise<CollectionRequest> {
		const collectionRequest = this.collectionRequestRepository.create(createDto);
		return await this.collectionRequestRepository.save(collectionRequest);
	}

	async update(id: number, updateDto: CollectionRequestUpdateDto): Promise<CollectionRequest> {
		const solicitud = await this.collectionRequestRepository.findOne({ where: { id } });
		if (!solicitud) {
			throw new BusinessException('Solicitud no encontrada', 400);
		}
		Object.assign(solicitud, updateDto);
		return await this.collectionRequestRepository.save(solicitud);
	}

	async findAll(query: any): Promise<Pagination<CollectionRequest>> {
		const queryBuilder = this.collectionRequestRepository.createQueryBuilder('solicitud');

		return paginate<CollectionRequest>(queryBuilder, {
			page: query.page,
			pageSize: query.pageSize,
		});
	}

	async findOne(id: number): Promise<CollectionRequest> {
		const solicitud = await this.collectionRequestRepository.findOne({ where: { id } });
		if (!solicitud) {
			throw new BusinessException('Solicitud no encontrada', 400);
		}
		return solicitud;
	}

	async remove(id: number): Promise<void> {
		const solicitud = await this.findOne(id);
		await this.collectionRequestRepository.remove(solicitud);
	}
}
