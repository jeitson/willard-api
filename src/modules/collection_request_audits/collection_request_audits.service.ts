import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { CollectionRequestAudit } from './entities/collection_request_audit.entity';
import { CollectionRequestAuditCreateDto, CollectionRequestAuditUpdateDto } from './dto/collection_request_audit.dto';

@Injectable()
export class CollectionRequestAuditsService {
	constructor(
		@InjectRepository(CollectionRequestAudit)
		private readonly repository: Repository<CollectionRequestAudit>,
	) { }

	async create(dto: CollectionRequestAuditCreateDto): Promise<CollectionRequestAudit> {
		const entity = this.repository.create(dto);
		return await this.repository.save(entity);
	}

	async findOne(id: number): Promise<CollectionRequestAudit> {
		const entity = await this.repository.findOne({ where: { id } });
		if (!entity) {
			throw new BusinessException('Auditoría de solicitud de recogida no encontrada');
		}
		return entity;
	}

	async findAll(query): Promise<CollectionRequestAudit[]> {
		return await this.repository.find({
			where: query,
		});
	}
}
