import { Injectable, BadRequestException } from '@nestjs/common';
import { ReceptionDto, ReceptionDetailDto, ReceptionPhotoDto, ReceptionQueryDto, ReceptionUpdateDto } from './dto/create-reception.dto';
import { Reception } from './entities/reception.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionSite } from '../collection_sites/entities/collection_site.entity';
import { Transporter } from '../transporters/entities/transporter.entity';
import { Product } from '../products/entities/product.entity';
import { ReceptionDetail } from './entities/reception_detail.entity';
import { ReceptionPhoto } from './entities/reception_photo.entity';
import { UserContextService } from '../users/user-context.service';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { Child } from '../catalogs/entities/child.entity';


/** Estados ID
 * 1 = Registrado
 *  **/

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
		const { collectionSites, id: user_id } = this.userContextService.getUserDetails();

		const collectionSite = await this.collectionSiteRepository.findOneBy({ id: In(collectionSites) });
		if (!collectionSite) {
			throw new BadRequestException('El usuario no tiene vinculado una sede de acopio.');
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
		const savedReception = await this.receptionRepository.save({ ...reception, createdBy: user_id, modifiedBy: user_id, receptionStatusId: 67, collectionSite });

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

	async update(id: number, updateReceptionDto: ReceptionUpdateDto): Promise<Reception> {
		const reception = await this.receptionRepository.findOneBy({ id });
		if (!reception) {
			throw new BusinessException('Recepción no encontrada.', 404);
		}

		const { collectionSites, id: user_id } = this.userContextService.getUserDetails();

		const collectionSite = await this.collectionSiteRepository.findOneBy({ id: In(collectionSites) });
		if (!collectionSite) {
			throw new BadRequestException('El usuario no tiene vinculado una sede de acopio.');
		}

		// aplica si la sede de acopio es una agencia
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
			const updatedReception = this.receptionRepository.create({ ...reception, collectionSite, ...updateReceptionDto, modifiedBy: user_id });
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

	async findAll({
		page,
		pageSize,
		transporterId,
	}: ReceptionQueryDto): Promise<Pagination<Reception>> {
		const queryBuilder = this.receptionRepository
			.createQueryBuilder('reception')
			.leftJoinAndSelect('reception.receptionDetails', 'details')
			.leftJoinAndSelect('reception.receptionPhotos', 'photos')
			.leftJoinAndMapOne('reception.child', Child, 'child', 'child.id = reception.receptionStatusId')
			.where({});

		if (transporterId) {
			queryBuilder.andWhere('reception.transporterId = :transporterId', { transporterId });
		}

		queryBuilder.select([
			'reception',
			'details',
			'photos',
			'child.name'
		]);

		return paginate<Reception>(queryBuilder, {
			page,
			pageSize,
		});
	}

	async findOne(id: number): Promise<Reception> {
		const reception = await this.receptionRepository
			.createQueryBuilder('reception')
			.leftJoinAndSelect('reception.receptionDetails', 'details')
			.leftJoinAndSelect('reception.receptionPhotos', 'photos')
			.leftJoinAndMapOne('reception.child', Child, 'child', 'child.id = reception.receptionStatusId')
			.where('reception.id = :id', { id })
			.select([
				'reception',
				'details',
				'photos',
				'child.name'
			])
			.getOne();

		if (!reception) {
			throw new BadRequestException('Recepción no encontrada');
		}

		return reception;
	}

}
