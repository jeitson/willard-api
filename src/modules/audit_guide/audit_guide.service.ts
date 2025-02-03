import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AuditGuideConfirmUpdateDto, AuditGuideCreateDto, AuditGuideDetailUpdateDto } from './dto/audit_guide.dto';
import { AuditGuide } from './entities/audit_guide.entity';
import { AuditGuideDetail } from './entities/audit_guide_detail.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { UserContextService } from '../users/user-context.service';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { AuditGuideRoute } from './entities/audit_guide-ruta.entity';
import { TransporterTravel } from '../transporter_travel/entities/transporter_travel.entity';
import { CatalogsService } from '../catalogs/catalogs.service';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { Child } from '../catalogs/entities/child.entity';
import { User } from '../users/entities/user.entity';
import { Transporter } from '../transporters/entities/transporter.entity';
import { Shipment } from '../shipments/entities/shipment.entity';
import { AUDIT_GUIDE_STATUS } from 'src/core/constants/status.constant';
import { ShipmentDetail } from '../shipments/entities/shipment_detail.entity';
import { ShipmentPhoto } from '../shipments/entities/shipment_photo.entity';
import { ReportsPhService } from '../reports_ph/reports_ph.service';

@Injectable()
export class AuditGuideService {
	constructor(
		@InjectRepository(AuditGuide)
		private readonly auditGuideRepository: Repository<AuditGuide>,

		@InjectRepository(AuditGuideDetail)
		private readonly auditGuideDetailRepository: Repository<AuditGuideDetail>,

		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,

		private readonly userContextService: UserContextService,

		@InjectRepository(AuditGuideRoute)
		private readonly auditGuideRouteRepository: Repository<AuditGuideRoute>,

		@InjectRepository(TransporterTravel)
		private readonly transporterTravelRepository: Repository<TransporterTravel>,

		private readonly catalogsService: CatalogsService,
		private readonly reportsPhService: ReportsPhService,
	) { }

	async create(createAuditGuideDto: AuditGuideCreateDto): Promise<void> {
		const { id: userId } = this.userContextService.getUserDetails();
		let { auditGuideDetails, transporterTotal, ...auditGuideData } = createAuditGuideDto;

		const queryRunner = this.auditGuideRepository.manager.connection.createQueryRunner();
		await queryRunner.startTransaction();

		try {
			let requestStatusId = AUDIT_GUIDE_STATUS.WITHOUT_GUIDE;
			let zoneId = null;
			let date = null;

			const transporterTravel = await this.transporterTravelRepository.findOne({
				where: { guideId: createAuditGuideDto.guideNumber.toUpperCase() },
				relations: ['details'],
			});

			if (transporterTravel) {
				({ requestStatusId, date, zoneId, auditGuideDetails, transporterTotal } = await this.handleTransporterTravel(
					transporterTravel,
					auditGuideDetails,
					transporterTotal,
				));
			}

			const auditGuide = this.auditGuideRepository.create({
				...auditGuideData,
				zoneId,
				date,
				transporterTotal,
				requestStatusId,
				createdBy: userId,
				modifiedBy: userId,
			});

			const auditGuideSaved = await queryRunner.manager.save(auditGuide);
			if (!auditGuideSaved.id) {
				throw new BusinessException('Error al guardar la guía de auditoría.', 500);
			}

			await this.saveAuditDetails(queryRunner, auditGuideDetails, auditGuideSaved);

			await this.verifyAndConfirmDetails(auditGuideDetails, auditGuideSaved);

			if (transporterTravel) {
				await this.saveAuditRoute(queryRunner, auditGuideSaved, transporterTravel, userId);
			}

			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}

	async updateDetails(id: number, updateDto: AuditGuideDetailUpdateDto): Promise<void> {
		const auditGuide = await this.findAuditGuideById(id);
		if (auditGuide.requestStatusId !== AUDIT_GUIDE_STATUS.PENDING) {
			throw new BusinessException('La auditoría no aplica para realizar esta acción.');
		}

		const { transporterTotal, recuperatorTotal } = await this.updateAuditDetails(updateDto);

		auditGuide.transporterTotal = transporterTotal;
		auditGuide.recuperatorTotal = recuperatorTotal;
		await this.auditGuideRepository.save(auditGuide);
	}

	async confirm(id: number, { comment, auditGuideDetails, giveReason }: AuditGuideConfirmUpdateDto): Promise<void> {
		const auditGuide = await this.findAuditGuideById(id);
		if (auditGuide.requestStatusId !== AUDIT_GUIDE_STATUS.PENDING) {
			throw new BusinessException('La auditoría no aplica para realizar esta acción.');
		}

		auditGuide.requestStatusId = AUDIT_GUIDE_STATUS.CONFIRMED;
		auditGuide.comment = comment;

		auditGuide.inFavorRecuperator = giveReason === 'R';

		const { transporterTotal, recuperatorTotal } = await this.updateAuditDetails({ auditGuideDetails });

		auditGuide.transporterTotal = transporterTotal;
		auditGuide.recuperatorTotal = recuperatorTotal;
		await this.auditGuideRepository.save(auditGuide);

		// crear reporte_ph
		// auditGuide.auditGuideDetails.forEach(async (element) => {
		// 	await this.reportsPhService.create({
		// 		collectionSiteId: auditGuide.reception.collectionSite.id,
		// 		guideNumber: auditGuide.guideNumber,
		// 		productId: element.product.id,
		// 		clientId: null
		// 	});
		// })
	}

	async findOne(id: string): Promise<AuditGuide> {
		return this.auditGuideRepository.findOne({
			where: { id: +id },
			relations: ['auditGuideDetails', 'auditsGuidesRoutes', 'reception', 'transporterTravel'],
		});
	}

	async findAll(query: any): Promise<Pagination<AuditGuide>> {
		const queryBuilder = this.auditGuideRepository.createQueryBuilder('auditGuide')
			.leftJoinAndSelect('auditGuide.auditGuideDetails', 'auditGuideDetails')
			.leftJoinAndSelect('auditGuideDetails.product', 'product')
			.leftJoinAndSelect('auditGuide.reception', 'reception')
			.leftJoinAndSelect('auditGuide.auditsGuidesRoutes', 'auditsGuidesRoutes')
			.leftJoinAndSelect('auditsGuidesRoutes.transporterTravel', 'transporterTravel')
			.leftJoinAndMapOne('auditGuide.requestStatus', Child, 'requestStatus', 'requestStatus.id = auditGuide.requestStatusId')
			.leftJoinAndMapOne('auditGuide.zone', Child, 'zone', 'zone.id = auditGuide.zoneId')
			.leftJoinAndMapOne('auditGuide.recuperator', User, 'recuperator', 'recuperator.id = auditGuide.recuperatorId')
			.leftJoinAndMapOne('auditGuide.transporter', Transporter, 'transporter', 'transporter.id = auditGuide.transporterId')
			.leftJoinAndMapMany('auditGuide.shipments', Shipment, 'shipment', 'shipment.guideNumber = auditGuide.guideNumber')
			.leftJoinAndSelect('shipment.collectionSite', 'collectionSite')
			.leftJoinAndSelect('shipment.shipmentDetails', 'ShipmentDetail')
			.leftJoinAndSelect('shipment.shipmentPhotos', 'ShipmentPhoto');

		const rawResults = await paginate<AuditGuide>(queryBuilder, {
			page: query.page,
			pageSize: query.pageSize,
		});

		const groupedResults: any = rawResults.items.map(auditGuide => {
			const groupedDetails = auditGuide.auditGuideDetails.reduce((acc, detail) => {
				if (detail.isRecuperator) {
					acc.recuperator.detail = [...acc.recuperator.detail, detail]
					acc.recuperator.quantity += detail.quantity;
					acc.recuperator.quantityCollection += detail.quantityCollection;
				} else {
					acc.transporter.detail = [...acc.transporter.detail, detail]
					acc.transporter.quantity += detail.quantity;
					acc.transporter.quantityCollection += detail.quantityCollection;
				}

				return acc;
			}, { recuperator: { detail: [], quantity: 0, quantityCollection: 0 }, transporter: { detail: [], quantity: 0, quantityCollection: 0 } });
			return {
				...auditGuide,
				auditGuideDetails: groupedDetails || [],
			};
		});

		return {
			...rawResults,
			items: groupedResults,
		};
	}

	private async verifyAndConfirmDetails(
		auditGuideDetails: any[],
		auditGuideSaved: AuditGuide,
	): Promise<void> {
		const totalQuantity = auditGuideDetails.reduce((sum, detail) => sum + detail.quantity, 0);
		const totalProducts = await this.productRepository.count({
			where: { id: In(auditGuideDetails.map(detail => detail.productId)) },
		});

		if (auditGuideDetails.length === totalProducts && totalQuantity === auditGuideSaved.transporterTotal) {
			auditGuideSaved.requestStatusId = AUDIT_GUIDE_STATUS.CONFIRMED;
			await this.auditGuideRepository.save(auditGuideSaved);
		}
	}

	private async handleTransporterTravel(
		transporterTravel: TransporterTravel,
		auditGuideDetails: any[],
		transporterTotal: number,
	) {
		const zone = await this.catalogsService.getChildrenByName(transporterTravel.zone);
		if (!zone) {
			throw new BusinessException('No existe la zona configurada para la guía.', 400);
		}

		const productNames = transporterTravel.details.map((item) => item.batteryType);
		const foundProducts = await this.productRepository.find({ where: { name: In(productNames) } });
		if (foundProducts.length !== productNames.length) {
			throw new BusinessException(`Verifique los productos ingresados: ${productNames.join(', ')}`);
		}

		const transporterDetails = foundProducts.map((product) => {
			const { quantity } = transporterTravel.details.find(({ batteryType }) => batteryType === product.name);
			transporterTotal += quantity;

			return {
				productId: product.id,
				isRecuperator: false,
				quantity,
				quantityCollection: quantity,
			};
		});

		auditGuideDetails.push(...transporterDetails);

		return {
			requestStatusId: AUDIT_GUIDE_STATUS.PENDING,
			date: transporterTravel.movementDate,
			zoneId: zone[0].id,
			auditGuideDetails,
			transporterTotal,
		};
	}

	private async saveAuditDetails(queryRunner, details: any[], auditGuideSaved: AuditGuide) {
		const detailsToSave = details.map((detail) =>
			this.auditGuideDetailRepository.create({
				...detail,
				auditGuide: auditGuideSaved,
			}),
		);
		await queryRunner.manager.save(AuditGuideDetail, detailsToSave);
	}

	private async saveAuditRoute(queryRunner, auditGuide: AuditGuide, transporterTravel: TransporterTravel, userId: number) {
		const auditGuideRoute = this.auditGuideRouteRepository.create({
			auditGuide,
			transporterTravel,
			createdBy: userId.toString(),
			updatedBy: userId.toString(),
		});
		await queryRunner.manager.save(auditGuideRoute);
	}

	private async findAuditGuideById(id: number): Promise<AuditGuide> {
		const auditGuide = await this.auditGuideRepository.findOne({ where: { id } });
		if (!auditGuide) {
			throw new BusinessException(`No se encontró la auditoría con el ID ${id}`);
		}
		return auditGuide;
	}

	private async updateAuditDetails(updateDto: AuditGuideDetailUpdateDto) {
		let transporterTotal = 0;
		let recuperatorTotal = 0;

		for (const detail of updateDto.auditGuideDetails) {
			const existingDetail = await this.auditGuideDetailRepository.findOne({ where: { id: detail.id } });
			if (!existingDetail) {
				throw new BusinessException(`No se encontró el detalle de auditoría con el ID ${detail.id}`);
			}

			existingDetail.quantityCollection = detail.quantityCollection;
			await this.auditGuideDetailRepository.save(existingDetail);

			if (existingDetail.isRecuperator) {
				recuperatorTotal += existingDetail.quantityCollection;
			} else {
				transporterTotal += existingDetail.quantityCollection;
			}
		}

		return { transporterTotal, recuperatorTotal };
	}

	async synchronize(id: number): Promise<void> {
		const auditGuide = await this.findAuditGuideById(id);

		if (auditGuide.requestStatusId !== AUDIT_GUIDE_STATUS.WITHOUT_GUIDE) {
			throw new BusinessException('Solo se pueden sincronizar auditorías en estado "sin guia".');
		}

		const queryRunner = this.auditGuideRepository.manager.connection.createQueryRunner();
		await queryRunner.startTransaction();

		try {
			const externalData = await this.fetchExternalData();
			if (!externalData) {
				throw new BusinessException('No se encontraron datos externos para sincronizar.', 404);
			}

			const { transporterTotal, recuperatorTotal } = await this.syncAuditDetails(queryRunner, auditGuide, externalData);

			auditGuide.transporterTotal = transporterTotal;
			auditGuide.recuperatorTotal = recuperatorTotal;
			auditGuide.requestStatusId = AUDIT_GUIDE_STATUS.PENDING;

			await queryRunner.manager.save(auditGuide);

			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}

	private async fetchExternalData(): Promise<any> {
		return {
			details: [
				{ productName: 'Battery A', quantity: 10 },
				{ productName: 'Battery B', quantity: 5 },
			],
		};
	}

	private async syncAuditDetails(queryRunner, auditGuide: AuditGuide, externalData: any): Promise<any> {
		let transporterTotal = 0;
		let recuperatorTotal = 0;

		const productNames = externalData.details.map((item) => item.productName);
		const foundProducts = await this.productRepository.find({ where: { name: In(productNames) } });
		if (foundProducts.length !== productNames.length) {
			throw new BusinessException('No se pudieron validar todos los productos de los datos externos.');
		}

		const detailsToSave = foundProducts.map((product) => {
			const { quantity } = externalData.details.find(({ productName }) => productName === product.name);

			return this.auditGuideDetailRepository.create({
				auditGuide,
				product,
				isRecuperator: false,
				quantity,
				quantityCollection: quantity,
			});
		});

		await queryRunner.manager.save(AuditGuideDetail, detailsToSave);

		detailsToSave.forEach((detail) => {
			if (detail.isRecuperator) {
				recuperatorTotal += detail.quantity;
			} else {
				transporterTotal += detail.quantity;
			}
		});

		return { transporterTotal, recuperatorTotal };
	}

	async updateInFavorRecuperator({ id, key }: { id: number; key: string }): Promise<void> {
		const auditGuide = await this.auditGuideRepository.findOne({ where: { id } });

		if (!auditGuide) {
			throw new BusinessException('No se encontró la auditoría especificada.', 404);
		}

		if (auditGuide.requestStatusId !== AUDIT_GUIDE_STATUS.PENDING) {
			throw new BusinessException('La auditoría debe estar en estado pendiente para actualizar.');
		}

		auditGuide.inFavorRecuperator = key === 'R';

		await this.auditGuideRepository.save(auditGuide);
	}


}
