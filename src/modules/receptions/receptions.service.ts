import { Injectable, BadRequestException } from '@nestjs/common';
import { ReceptionDto, ReceptionDetailDto, ReceptionPhotoDto } from './dto/create-reception.dto';
import { Reception } from './entities/reception.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionSite } from '../collection_sites/entities/collection_site.entity';
import { Transporter } from '../transporters/entities/transporter.entity';
import { Product } from '../products/entities/product.entity';
import { ReceptionDetail } from './entities/reception_detail.entity';
import { ReceptionPhoto } from './entities/reception_photo.entity';
import { UserContextService } from '../users/user-context.service';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';

@Injectable()
export class ReceptionsService {
	constructor(
		@InjectRepository(Reception)
		private readonly receptionRepository: Repository<Reception>,
		@InjectRepository(ReceptionDetail)
		private readonly receptionDetailRepository: Repository<ReceptionDetail>,
		@InjectRepository(ReceptionPhoto)
		private readonly receptionPhotoRepository: Repository<ReceptionPhoto>,
		@InjectRepository(CollectionSite)
		private readonly collectionSiteRepository: Repository<CollectionSite>,
		@InjectRepository(Transporter)
		private readonly transporterRepository: Repository<Transporter>,
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,
		private readonly userContextService: UserContextService
	) { }

	async create(createReceptionDto: ReceptionDto): Promise<Reception> {
		const user_id = this.userContextService.getUserDetails().id;

		const collectionSite = await this.collectionSiteRepository.findOneBy({ id: createReceptionDto.collectionSiteId });
		if (!collectionSite) {
			throw new BadRequestException('El lugar de recogida no es válido.');
		}

		// aplica si la sede de acopio es una agencia
		if (collectionSite.siteTypeId === 52) {
			if (!createReceptionDto.referenceDoc1) {
				throw new BadRequestException('DocReferencia1 es obligatorio cuando el lugar de recogida es una sede de acopio.');
			}
			if (!createReceptionDto.referenceDoc2) {
				throw new BadRequestException('DocReferencia2 es obligatorio cuando el lugar de recogida es una sede de acopio.');
			}
		}

		const transporter = await this.transporterRepository.findOneBy({ id: createReceptionDto.transporterId });
		if (!transporter) {
			throw new BadRequestException('La transportadora no es válida.');
		}

		if (createReceptionDto.details) {
			await this.validateReceptionDetails(createReceptionDto.details);
		}

		const reception = this.receptionRepository.create(createReceptionDto);
		const savedReception = await this.receptionRepository.save({ ...reception, createdBy: user_id, modifiedBy: user_id });

		try {
			if (createReceptionDto.details) {
				await this.saveReceptionDetails(savedReception.id, createReceptionDto.details);
			}

			if (createReceptionDto.photos) {
				await this.saveReceptionPhotos(savedReception.id, createReceptionDto.photos);
			}

		} catch (error) {
			await this.receptionRepository.delete(savedReception.id);
			throw new BadRequestException('Error al crear la recepción: ' + error.message);
		}

		return savedReception;
	}

	private async validateReceptionDetails(details: ReceptionDetailDto[]): Promise<void> {
		for (const detail of details) {
			const product = await this.productRepository.findOneBy({ id: detail.productId });
			if (!product) {
				throw new BadRequestException(`El producto con ID ${detail.productId} no es válido.`);
			}

			if (detail.quantity < 1 || detail.quantity > 10000) {
				throw new BadRequestException(`La cantidad del producto ${detail.productId} debe estar entre 1 y 10,000.`);
			}
		}
	}

	private async saveReceptionDetails(receptionId: number, details: ReceptionDetailDto[]): Promise<void> {
		const user_id = this.userContextService.getUserDetails().id;

		const receptionDetails = details.map(detail => {
			const receptionDetail = this.receptionDetailRepository.create({
				...detail,
				createdBy: user_id, modifiedBy: user_id,
				reception: { id: receptionId },
			});
			return receptionDetail;
		});

		await this.receptionDetailRepository.save(receptionDetails);
	}

	private async saveReceptionPhotos(receptionId: number, photos: ReceptionPhotoDto[]): Promise<void> {
		const user_id = this.userContextService.getUserDetails().id;

		const receptionPhotos = photos.map(photo => {
			const receptionPhoto = this.receptionPhotoRepository.create({
				...photo,
				createdBy: user_id, modifiedBy: user_id,
				reception: { id: receptionId },
			});
			return receptionPhoto;
		});

		await this.receptionPhotoRepository.save(receptionPhotos);
	}

	async update(id: number, updateReceptionDto: ReceptionDto): Promise<Reception> {
		const user_id = this.userContextService.getUserDetails().id;

		const reception = await this.receptionRepository.findOneBy({ id });
		if (!reception) {
			throw new BusinessException('Recepción no encontrada.', 404);
		}

		const collectionSite = await this.collectionSiteRepository.findOneBy({ id: updateReceptionDto.collectionSiteId });
		if (!collectionSite) {
			throw new BadRequestException('El lugar de recogida no es válido.');
		}

		if (collectionSite.siteTypeId === 52) {
			if (!updateReceptionDto.referenceDoc1) {
				throw new BadRequestException('DocReferencia1 es obligatorio cuando el lugar de recogida es una sede de acopio.');
			}
			if (!updateReceptionDto.referenceDoc2) {
				throw new BadRequestException('DocReferencia2 es obligatorio cuando el lugar de recogida es una sede de acopio.');
			}
		}

		const transporter = await this.transporterRepository.findOneBy({ id: updateReceptionDto.transporterId });
		if (!transporter) {
			throw new BadRequestException('La transportadora no es válida.');
		}

		if (updateReceptionDto.details) {
			await this.validateReceptionDetails(updateReceptionDto.details);
		}

		try {
			const updatedReception = this.receptionRepository.create({ ...reception, ...updateReceptionDto, modifiedBy: user_id });
			const savedReception = await this.receptionRepository.save(updatedReception);

			if (updateReceptionDto.details) {
				await this.updateReceptionDetails(savedReception.id, updateReceptionDto.details);
			}

			if (updateReceptionDto.photos) {
				await this.updateReceptionPhotos(savedReception.id, updateReceptionDto.photos);
			}

			return savedReception;

		} catch (error) {
			throw new BadRequestException('Error al actualizar la recepción: ' + error.message);
		}
	}

	private async updateReceptionDetails(receptionId: number, details: ReceptionDetailDto[]): Promise<void> {
		const user_id = this.userContextService.getUserDetails().id;

		await this.receptionDetailRepository.delete({ reception: { id: receptionId } });

		const receptionDetails = details.map(detail => {
			const receptionDetail = this.receptionDetailRepository.create({
				...detail,
				createdBy: user_id,
				modifiedBy: user_id,
				reception: { id: receptionId },
			});
			return receptionDetail;
		});

		await this.receptionDetailRepository.save(receptionDetails);
	}

	private async updateReceptionPhotos(receptionId: number, photos: ReceptionPhotoDto[]): Promise<void> {
		const user_id = this.userContextService.getUserDetails().id;

		await this.receptionPhotoRepository.delete({ reception: { id: receptionId } });

		const receptionPhotos = photos.map(photo => {
			const receptionPhoto = this.receptionPhotoRepository.create({
				...photo,
				createdBy: user_id,
				modifiedBy: user_id,
				reception: { id: receptionId },
			});
			return receptionPhoto;
		});

		await this.receptionPhotoRepository.save(receptionPhotos);
	}

}
