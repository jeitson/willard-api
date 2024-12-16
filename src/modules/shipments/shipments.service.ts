import { Injectable, BadRequestException } from '@nestjs/common';
import { ShipmentDto, ShipmentDetailDto, ShipmentPhotoDto, ShipmentQueryDto, ShipmentUpdateDto, ShipmentERCDto } from './dto/create-shipment.dto';
import { Shipment } from './entities/shipment.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionSite } from '../collection_sites/entities/collection_site.entity';
import { Transporter } from '../transporters/entities/transporter.entity';
import { Product } from '../products/entities/product.entity';
import { ShipmentDetail } from './entities/shipment_detail.entity';
import { ShipmentPhoto } from './entities/shipment_photo.entity';
import { UserContextService } from '../users/user-context.service';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { Child } from '../catalogs/entities/child.entity';
import { ShipmentERC } from './entities/shipment_erc.entity';
import { PICKUP_LOCATION_TYPE } from 'src/core/constants/types.constant';

@Injectable()
export class ShipmentsService {
	constructor(
		@InjectRepository(Shipment)
		private readonly shipmentRepository: Repository<Shipment>,
		@InjectRepository(ShipmentDetail)
		private readonly shipmentDetailRepository: Repository<ShipmentDetail>,
		@InjectRepository(ShipmentPhoto)
		private readonly shipmentPhotoRepository: Repository<ShipmentPhoto>,
		@InjectRepository(ShipmentERC)
		private readonly shipmentERCRepository: Repository<ShipmentERC>,
		@InjectRepository(CollectionSite)
		private readonly collectionSiteRepository: Repository<CollectionSite>,
		@InjectRepository(Transporter)
		private readonly transporterRepository: Repository<Transporter>,
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,
		private readonly userContextService: UserContextService
	) { }

	async create(createShipmentDto: ShipmentDto): Promise<Shipment> {
		const { collectionSites, id: user_id } = this.userContextService.getUserDetails();

		const collectionSite = await this.collectionSiteRepository.findOneBy({ id: In(collectionSites.map(({ collectionSiteId }) => collectionSiteId)) });

		if (!collectionSite) {
			throw new BadRequestException('El usuario no tiene vinculado una sede de acopio.');
		}

		// aplica si la sede de acopio es una agencia
		if (collectionSite.siteTypeId === PICKUP_LOCATION_TYPE.AGENCY) {
			if (!createShipmentDto.referenceDoc1) {
				throw new BadRequestException('DocReferencia1 es obligatorio cuando el lugar de recogida es una sede de acopio.');
			}
			if (!createShipmentDto.referenceDoc2) {
				throw new BadRequestException('DocReferencia2 es obligatorio cuando el lugar de recogida es una sede de acopio.');
			}
		}

		const transporter = await this.transporterRepository.findOneBy({ id: createShipmentDto.transporterId });
		if (!transporter) {
			throw new BadRequestException('La transportadora no es válida.');
		}

		// if (createShipmentDto.details) {
		// 	await this.validateShipmentDetails(createShipmentDto.details);
		// }

		const shipment = this.shipmentRepository.create(createShipmentDto);
		const savedShipment = await this.shipmentRepository.save({ ...shipment, createdBy: user_id, modifiedBy: user_id, shipmentStatusId: 67, collectionSite });

		try {
			if (createShipmentDto.details) {
				await this.saveShipmentDetails(savedShipment, createShipmentDto.details);
			}

			if (createShipmentDto.photos) {
				await this.saveShipmentPhotos(savedShipment, (createShipmentDto.photos as any[]).map(url => ({ url })));
			}

			if (createShipmentDto.erc) {
				await this.saveShipmentERC(savedShipment, (createShipmentDto.erc as any[]).map(name => ({ name })));
			}

		} catch (error) {
			await this.shipmentDetailRepository.delete({ shipment });
			await this.shipmentPhotoRepository.delete({ shipment });
			await this.shipmentERCRepository.delete({ shipment });
			await this.shipmentRepository.delete(savedShipment.id);
			throw new BadRequestException('Error al crear la recepción: ' + error.message);
		}

		return savedShipment;
	}

	private async saveShipmentDetails(shipment: Shipment, details: ShipmentDetailDto[]): Promise<void> {
		const user_id = this.userContextService.getUserDetails().id;

		details.forEach(async (detail) => {
			const product = await this.productRepository.findOneBy({ id: detail.productId });
			if (!product) {
				throw new BadRequestException(`El producto con ID ${detail.productId} no es válido.`);
			}

			if (detail.quantity < 1 || detail.quantity > 10000) {
				throw new BadRequestException(`La cantidad del producto ${detail.productId} debe estar entre 1 y 10,000.`);
			}

			const shipmentDetail = this.shipmentDetailRepository.create({
				...detail,
				createdBy: user_id, modifiedBy: user_id,
				shipment,
				product
			});

			await this.shipmentDetailRepository.save(shipmentDetail);
		});

	}

	private async saveShipmentPhotos(shipment: Shipment, photos: ShipmentPhotoDto[]): Promise<void> {
		const user_id = this.userContextService.getUserDetails().id;

		const shipmentPhotos = photos.map(({ url }) => {
			const shipmentPhoto = this.shipmentPhotoRepository.create({
				url,
				createdBy: user_id, modifiedBy: user_id,
				shipment,
			});
			return shipmentPhoto;
		});


		await this.shipmentPhotoRepository.save(shipmentPhotos);
	}

	private async saveShipmentERC(shipment: Shipment, photos: ShipmentERCDto[]): Promise<void> {
		const user_id = this.userContextService.getUserDetails().id;

		const shipmentERCs = photos.map(({ name }) => {
			const shipmentERC = this.shipmentERCRepository.create({
				name,
				createdBy: user_id, modifiedBy: user_id,
				shipment,
			});
			return shipmentERC;
		});


		await this.shipmentERCRepository.save(shipmentERCs);
	}

	async update(id: number, updateShipmentDto: ShipmentUpdateDto): Promise<Shipment> {
		const shipment = await this.shipmentRepository.findOneBy({ id });
		if (!shipment) {
			throw new BusinessException('Recepción no encontrada.', 404);
		}

		const { collectionSites, id: user_id } = this.userContextService.getUserDetails();

		const collectionSite = await this.collectionSiteRepository.findOneBy({ id: In(collectionSites) });
		if (!collectionSite) {
			throw new BadRequestException('El usuario no tiene vinculado una sede de acopio.');
		}

		// aplica si la sede de acopio es una agencia
		if (collectionSite.siteTypeId === PICKUP_LOCATION_TYPE.AGENCY) {
			if (!updateShipmentDto.referenceDoc1) {
				throw new BadRequestException('DocReferencia1 es obligatorio cuando el lugar de recogida es una sede de acopio.');
			}
			if (!updateShipmentDto.referenceDoc2) {
				throw new BadRequestException('DocReferencia2 es obligatorio cuando el lugar de recogida es una sede de acopio.');
			}
		}

		const transporter = await this.transporterRepository.findOneBy({ id: updateShipmentDto.transporterId });
		if (!transporter) {
			throw new BadRequestException('La transportadora no es válida.');
		}

		// if (updateShipmentDto.details) {
		// 	await this.validateShipmentDetails(updateShipmentDto.details);
		// }

		try {
			const updatedShipment = this.shipmentRepository.create({ ...shipment, collectionSite, ...updateShipmentDto, modifiedBy: user_id });
			const savedShipment = await this.shipmentRepository.save(updatedShipment);

			if (updateShipmentDto.details) {
				await this.updateShipmentDetails(savedShipment.id, updateShipmentDto.details);
			}

			if (updateShipmentDto.photos) {
				await this.updateShipmentPhotos(savedShipment.id, updateShipmentDto.photos);
			}

			if (updateShipmentDto.erc) {
				await this.updateShipmentERC(savedShipment.id, (updateShipmentDto.erc as any[]).map(name => ({ name })));
			}

			return savedShipment;

		} catch (error) {
			throw new BadRequestException('Error al actualizar la recepción: ' + error.message);
		}
	}

	private async updateShipmentDetails(shipmentId: number, details: ShipmentDetailDto[]): Promise<void> {
		const user_id = this.userContextService.getUserDetails().id;

		await this.shipmentDetailRepository.delete({ shipment: { id: shipmentId } });

		for (const detail of details) {
			const product = await this.productRepository.findOneBy({ id: detail.productId });
			if (!product) {
				throw new BadRequestException(`El producto con ID ${detail.productId} no es válido.`);
			}

			if (detail.quantity < 1 || detail.quantity > 10000) {
				throw new BadRequestException(`La cantidad del producto ${detail.productId} debe estar entre 1 y 10,000.`);
			}

			const shipmentDetail = this.shipmentDetailRepository.create({
				...detail,
				createdBy: user_id,
				modifiedBy: user_id,
				shipment: { id: shipmentId },
				product,
			});
			await this.shipmentDetailRepository.save(shipmentDetail);

		}
	}

	private async updateShipmentPhotos(shipmentId: number, photos: ShipmentPhotoDto[]): Promise<void> {
		const user_id = this.userContextService.getUserDetails().id;

		await this.shipmentPhotoRepository.delete({ shipment: { id: shipmentId } });

		const shipmentPhotos = photos.map(photo => {
			const shipmentPhoto = this.shipmentPhotoRepository.create({
				...photo,
				createdBy: user_id,
				modifiedBy: user_id,
				shipment: { id: shipmentId },
			});
			return shipmentPhoto;
		});

		await this.shipmentPhotoRepository.save(shipmentPhotos);
	}

	private async updateShipmentERC(shipmentId: number, content: ShipmentERCDto[]): Promise<void> {
		const user_id = this.userContextService.getUserDetails().id;

		await this.shipmentERCRepository.delete({ shipment: { id: shipmentId } });

		const shipmentERCs = content.map(({ name }) => {
			const shipmentERC = this.shipmentERCRepository.create({
				name,
				createdBy: user_id,
				modifiedBy: user_id,
				shipment: { id: shipmentId },
			});
			return shipmentERC;
		});

		await this.shipmentERCRepository.save(shipmentERCs);
	}

	async findAll({
		page,
		pageSize,
		transporterId,
	}: ShipmentQueryDto): Promise<Pagination<Shipment>> {
		const queryBuilder = this.shipmentRepository
			.createQueryBuilder('shipment')
			.leftJoinAndSelect('shipment.shipmentDetails', 'details')
			.leftJoinAndSelect('shipment.shipmentPhotos', 'photos')
			.leftJoinAndMapOne('shipment.child', Child, 'child', 'child.id = shipment.shipmentStatusId')
			.where({});

		if (transporterId) {
			queryBuilder.andWhere('shipment.transporterId = :transporterId', { transporterId });
		}

		queryBuilder.select([
			'shipment',
			'details',
			'photos',
			'child.name'
		]);

		return paginate<Shipment>(queryBuilder, {
			page,
			pageSize,
		});
	}

	async findOne(id: number): Promise<Shipment> {
		const shipment = await this.shipmentRepository
			.createQueryBuilder('shipment')
			.leftJoinAndSelect('shipment.shipmentDetails', 'details')
			.leftJoinAndSelect('shipment.shipmentPhotos', 'photos')
			.leftJoinAndMapOne('shipment.child', Child, 'child', 'child.id = shipment.shipmentStatusId')
			.where('shipment.id = :id', { id })
			.select([
				'shipment',
				'details',
				'photos',
				'child.name'
			])
			.getOne();

		if (!shipment) {
			throw new BadRequestException('Recepción no encontrada');
		}

		return shipment;
	}

}
