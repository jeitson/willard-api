import { Injectable, BadRequestException } from '@nestjs/common';
import { ReceptionDto, ReceptionDetailDto, ReceptionPhotoDto, ReceptionQueryDto, ReceptionUpdateDto, ReceptionRouteIdDto } from './dto/create-reception.dto';
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
import { RECEIPT_STATUS } from 'src/core/constants/status.constant';
import { PICKUP_LOCATION_TYPE } from 'src/core/constants/types.constant';
import { ROL } from 'src/core/constants/rol.constant';


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
		let { collectionSites, id: user_id, roles } = this.userContextService.getUserDetails();
		roles = roles.map(({ roleId }) => +roleId);

		const collectionSite = await this.collectionSiteRepository.findOneBy({ id: In(collectionSites.map(({ collectionSiteId }) => collectionSiteId)) });

		if (!collectionSite) {
			throw new BadRequestException('El usuario no tiene vinculado una sede de acopio.');
		}

		// aplica si la sede de acopio es una agencia
		if (collectionSite.siteTypeId === PICKUP_LOCATION_TYPE.AGENCY) {
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

		let details = [];
		if (createReceptionDto.details) {
			details = await this.validateReceptionDetails(createReceptionDto.details);
			if (details.length !== createReceptionDto.details.length) {
				throw new BadRequestException(`Verifique la información ingresada en el detalle`);
			}
		}


		const reception = this.receptionRepository.create(createReceptionDto);
		const savedReception = await this.receptionRepository.save({ ...reception, createdBy: user_id, modifiedBy: user_id, receptionStatusId: RECEIPT_STATUS.REGISTERED, collectionSite, transporter });

		try {
			if (details.length === createReceptionDto.details.length) {
				await this.saveReceptionDetails(savedReception, details.map((product: any) => ({ product, productId: product.id, quantity: (createReceptionDto.details as any).find((element: { productId: any; }) => element.productId === +product.id).quantity })));
			}

			if (createReceptionDto.photos) {
				await this.saveReceptionPhotos(savedReception, (createReceptionDto.photos as any[]).map(url => ({ url })));
			}

			if (roles.includes(ROL.RECUPERADORA)) {
				// await this.auditGuideService.create({
				// 	reception: savedReception,
				// 	routeId: reception.routeId,
				// 	recuperatorId: user_id,
				// 	recuperatorTotal: createReceptionDto.details.reduce((acc, item) => acc += item.quantity, 0),
				// 	transporterId: transporter.id,
				// 	transporterTotal: 0,
				// 	auditGuideDetails: createReceptionDto.details.map((item) => ({
				// 		productId: item.productId,
				// 		isRecuperator: true,
				// 		quantity: item.quantity,
				// 		quantityCollection: item.quantity
				// 	}))
				// });
			}

		} catch (error) {
			await this.receptionDetailRepository.delete({ reception: savedReception });
			await this.receptionPhotoRepository.delete({ reception: savedReception });
			await this.receptionRepository.delete(savedReception.id);
			throw new BadRequestException('Error al crear la recepción: ' + error.message);
		}

		return savedReception;
	}

	private async validateReceptionDetails(details: ReceptionDetailDto[]): Promise<Product[]> {
		for (const { productId: id, quantity: qty } of details) {
			if (qty < 1 || qty > 10000) {
				throw new BadRequestException(`La cantidad del producto ${id} debe estar entre 1 y 10,000.`);
			}
		}

		return Promise.all(details.map(async ({ productId: id, quantity: qty }) => await this.productRepository.findOneBy({ id })));
	}

	private async saveReceptionDetails(reception: Reception, details: ReceptionDetailDto[]): Promise<ReceptionDetail[]> {
		const user_id = this.userContextService.getUserDetails().id;

		const receptionDetails = details.map(detail => {
			const receptionDetail = this.receptionDetailRepository.create({
				...detail,
				createdBy: user_id, modifiedBy: user_id,
				reception,
			});
			return receptionDetail;
		});

		return await this.receptionDetailRepository.save(receptionDetails);
	}

	private async saveReceptionPhotos(reception: Reception, photos: ReceptionPhotoDto[]): Promise<ReceptionPhoto[]> {
		const user_id = this.userContextService.getUserDetails().id;

		const receptionPhotos = photos.map(({ url }) => {
			const receptionPhoto = this.receptionPhotoRepository.create({
				url,
				createdBy: user_id, modifiedBy: user_id,
				reception,
			});
			return receptionPhoto;
		});


		return this.receptionPhotoRepository.save(receptionPhotos);
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
		if (collectionSite.siteTypeId === PICKUP_LOCATION_TYPE.AGENCY) {
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
			.leftJoinAndSelect('details.product', 'product')
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

	async updateRouteId(id: number, { routeId }: ReceptionRouteIdDto): Promise<void> {
		const existingRecord = await this.receptionRepository.findOne({
			where: { id },
			relations: ['auditGuide'],
		});
		if (!existingRecord) {
			throw new BusinessException(`No se encontró ningún registro con ID: ${id}`);
		}

		// if (![AUDIT_GUIDE_STATUS.WITHOUT_GUIDE, AUDIT_GUIDE_STATUS.TRANSIT].includes(+existingRecord.auditGuide.requestStatusId)) {
		// 	throw new BusinessException(
		// 		`No se puede actualizar el registro, ya que tiene una vinculación activa con una transportadora.`
		// 	);
		// }

		const routeIdOld = JSON.parse(JSON.stringify(existingRecord.routeId));

		existingRecord.routeId = routeId;

		await this.receptionRepository.update(id, { routeId });

		// if (existingRecord.auditGuide) {
		// 	await this.auditGuideService.updateRouteId(routeIdOld, routeId);
		// }

		// await this.auditGuideService.checkAndSyncAuditGuides([routeId]);
	}
}
