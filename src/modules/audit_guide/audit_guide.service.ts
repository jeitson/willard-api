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
import { ReportsPhService } from '../reports_ph/reports_ph.service';
import { TransporterTravelDetail } from '../transporter_travel/entities/transporter_travel_detail.entity';
import { Reception } from '../receptions/entities/reception.entity';
import { ReceptionDetail } from '../receptions/entities/reception_detail.entity';

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

		@InjectRepository(TransporterTravelDetail)
		private readonly transporterTravelDetailRepository: Repository<TransporterTravelDetail>,

		@InjectRepository(ReceptionDetail)
		private readonly receptionDetailRepository: Repository<ReceptionDetail>,

		private readonly catalogsService: CatalogsService,
		private readonly reportsPhService: ReportsPhService,
		@InjectRepository(Child)
		private readonly childrensRepository: Repository<Child>,
	) { }

	async create(createAuditGuideDto: AuditGuideCreateDto): Promise<void> {
		const { id: userId } = this.userContextService.getUserDetails();
		let { auditGuideDetails, transporterTotal, ...auditGuideData } = createAuditGuideDto;

		const queryRunner = this.auditGuideRepository.manager.connection.createQueryRunner();
		await queryRunner.startTransaction();

		try {
			let { requestStatusId, zoneId, date } = {
				requestStatusId: AUDIT_GUIDE_STATUS.WITHOUT_GUIDE,
				zoneId: null,
				date: null,
			};

			const transporterTravel = await this.transporterTravelRepository.findOne({
				where: { guideId: createAuditGuideDto.guideNumber.toUpperCase() },
				relations: ['details'],
			});

			if (transporterTravel) {
				({ requestStatusId, date, zoneId, auditGuideDetails, transporterTotal } =
					await this.handleTransporterTravel(transporterTravel, auditGuideDetails, transporterTotal));
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

			const productIds = auditGuideDetails.map((item) => item.productId);
			const products = await this.productRepository.findBy({ id: In(productIds) });
			const productMap = new Map(products.map((product) => [product.id, product]));

			auditGuideDetails = auditGuideDetails.map((item) => ({
				...item,
				product: productMap.get((item.productId).toString() as any),
			}));

			await this.saveAuditDetails(queryRunner, auditGuideDetails, auditGuideSaved);

			if (transporterTravel) {
				await this.saveAuditRoute(queryRunner, auditGuideSaved, transporterTravel, userId);

				this.checkAndSyncAuditGuides([transporterTravel]);
			}

			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw new BusinessException(error.message || 'Error inesperado en la creación de la auditoría.', 500);
		} finally {
			await queryRunner.release();
		}
	}

	async updateDetails(id: number, updateDto: AuditGuideDetailUpdateDto): Promise<void> {
		const { id: userId } = this.userContextService.getUserDetails();

		const auditGuide = await this.findAuditGuideById(id);
		if (+auditGuide.requestStatusId !== AUDIT_GUIDE_STATUS.BY_CONCILLIATE) {
			throw new BusinessException('La auditoría no aplica para realizar esta acción.');
		}

		const { transporterTotal, recuperatorTotal } = await this.updateAuditDetails(updateDto, id);

		auditGuide.transporterTotal = transporterTotal;
		auditGuide.recuperatorTotal = recuperatorTotal;
		auditGuide.modifiedBy = userId;
		await this.auditGuideRepository.save(auditGuide);
	}

	async confirm(id: number, { comment, auditGuideDetails, giveReason }: AuditGuideConfirmUpdateDto): Promise<void> {
		const { id: userId } = this.userContextService.getUserDetails();

		const auditGuide = await this.findAuditGuideById(id);
		if (+auditGuide.requestStatusId !== AUDIT_GUIDE_STATUS.BY_CONCILLIATE) {
			throw new BusinessException('La auditoría no aplica para realizar esta acción.');
		}

		auditGuide.requestStatusId = AUDIT_GUIDE_STATUS.CONFIRMED;
		auditGuide.comment = comment;

		auditGuide.inFavorRecuperator = giveReason === 'R';

		const { transporterTotal, recuperatorTotal } = await this.updateAuditDetails({ auditGuideDetails }, id);

		auditGuide.transporterTotal = transporterTotal;
		auditGuide.recuperatorTotal = recuperatorTotal;
		auditGuide.modifiedBy = userId;
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

	async findOneByGuideNumber(guideNumber: string): Promise<AuditGuide> {
		return this.auditGuideRepository.findOne({
			where: { guideNumber },
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
			.leftJoinAndSelect('transporterTravel.details', 'details')
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
			pageSize: 30,
			// pageSize: query.pageSize,
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
			requestStatusId: AUDIT_GUIDE_STATUS.BY_CONCILLIATE,
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

	private async saveAuditRoute(queryRunner, auditGuide: AuditGuide, transporterTravel: TransporterTravel, userId: number | null) {
		const auditGuideRoute = this.auditGuideRouteRepository.create({
			auditGuide,
			transporterTravel,
			createdBy: userId?.toString(),
			updatedBy: userId?.toString(),
		});
		await queryRunner.manager.save(auditGuideRoute);
	}

	private async findAuditGuideById(id: number): Promise<AuditGuide> {
		const auditGuide = await this.auditGuideRepository.findOne({ where: { id }, relations: ['auditGuideDetails', 'auditsGuidesRoutes'] });
		if (!auditGuide) {
			throw new BusinessException(`No se encontró la auditoría con el ID ${id}`);
		}
		return auditGuide;
	}

	private async updateAuditDetails(updateDto: AuditGuideDetailUpdateDto, id: number): Promise<{ transporterTotal: number; recuperatorTotal: number }> {
		const { id: userId } = this.userContextService.getUserDetails();

		let transporterTotal = 0;
		let recuperatorTotal = 0;

		for (const detail of updateDto.auditGuideDetails) {
			if (!detail.id) {
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
			} else {
				if (!detail.productId || !detail.type) {
					throw new BusinessException('El producto y el tipo son obligatorios para crear un nuevo detalle.');
				}

				const product = await this.productRepository.findOneBy({ id: detail.productId })

				if (!product) {
					throw new BusinessException(`El producto ${detail.productId} no existe`);
				}

				const newDetail = this.auditGuideDetailRepository.create({
					product,
					isRecuperator: detail.type === 'R',
					quantity: detail.quantityCollection,
					quantityCollection: detail.quantityCollection,
					modifiedBy: userId,
				});

				const savedDetail = await this.auditGuideDetailRepository.save(newDetail);

				const createdBy = userId, modifiedBy = userId;

				if (detail.type === 'T') {
					this.transporterTravelDetailRepository.save({
						batteryType: product.name,
						quantity: detail.quantityCollection,
						createdBy, modifiedBy,
					});
				} else if (detail.type === 'R') {
					this.receptionDetailRepository.save({
						product,
						quantity: detail.quantityCollection,
						createdBy, modifiedBy,
						reception: { id }
					})
				}

				if (savedDetail.isRecuperator) {
					recuperatorTotal += savedDetail.quantityCollection;
				} else {
					transporterTotal += savedDetail.quantityCollection;
				}
			}
		}

		return { transporterTotal, recuperatorTotal };
	}

	async synchronize(id: number): Promise<void> {
		const user_id = this.userContextService.getUserDetails()?.id;

		const auditGuide = await this.findAuditGuideById(id);
		if (+auditGuide.requestStatusId !== AUDIT_GUIDE_STATUS.WITHOUT_GUIDE) {
			throw new BusinessException('Solo se pueden sincronizar auditorías en estado "sin guia".');
		}

		const queryRunner = this.auditGuideRepository.manager.connection.createQueryRunner();
		await queryRunner.startTransaction();

		try {
			const externalData = await this.fetchExternalData(auditGuide.guideNumber);
			if (!externalData) {
				throw new BusinessException('No se encontraron datos externos para sincronizar.', 404);
			}

			const zone = await this.childrensRepository.findOne({ where: { name: externalData.zone.toUpperCase() } });
			if (!zone) {
				throw new BusinessException('La zona configurada del viaje, no existe en el sistema');
			}

			const { transporterTotal, recuperatorTotal, isConfirmed } = await this.syncAuditDetails(queryRunner, auditGuide, externalData);

			await queryRunner.manager.update(AuditGuide, auditGuide.id, {
				transporterTotal,
				recuperatorTotal,
				date: externalData.movementDate,
				zoneId: zone.id,
				requestStatusId: isConfirmed ? AUDIT_GUIDE_STATUS.CONFIRMED : AUDIT_GUIDE_STATUS.BY_CONCILLIATE,
				modifiedBy: user_id,
			});

			const auditGuideRoute = this.auditGuideRouteRepository.create({
				auditGuide,
				transporterTravel: externalData,
				createdBy: user_id,
				updatedBy: user_id,
			});
			await queryRunner.manager.save(auditGuideRoute);

			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}

	private async fetchExternalData(guideId: string): Promise<TransporterTravel> {
		return this.transporterTravelRepository.findOne({ where: { guideId }, relations: ['details'] });
	}

	private async syncAuditDetails(
		queryRunner,
		auditGuide: AuditGuide,
		externalData: any
	): Promise<{ transporterTotal: number; recuperatorTotal: number; isConfirmed: boolean }> {
		const user_id = this.userContextService.getUserDetails()?.id;

		const productNames = externalData.details.map((item) => item.batteryType);
		const foundProducts = await this.productRepository.find({ where: { name: In(productNames) } });
		if (foundProducts.length !== productNames.length) {
			throw new BusinessException('No se pudieron validar todos los productos de los datos externos.');
		}

		const newDetailsToSave = foundProducts.map((product) => {
			const { quantity } = externalData.details.find(({ batteryType }) => batteryType === product.name);
			return this.auditGuideDetailRepository.create({
				auditGuide: auditGuide,
				product,
				isRecuperator: false,
				quantity,
				quantityCollection: quantity,
				createdBy: user_id,
				modifiedBy: user_id,
			});
		});

		await queryRunner.manager.save(AuditGuideDetail, newDetailsToSave);

		const allDetails = [
			...auditGuide.auditGuideDetails.map(({ isRecuperator, quantityCollection: quantity }) => ({
				isRecuperator,
				quantity,
			})),
			...newDetailsToSave.map(({ isRecuperator, quantity }) => ({ isRecuperator, quantity })),
		];

		const { transporterTotal, recuperatorTotal, transporterQty, recuperatorQty } = allDetails.reduce(
			(acc, detail) => {
				if (detail.isRecuperator) {
					acc.recuperatorTotal += detail.quantity;
					acc.recuperatorQty++;
				} else {
					acc.transporterTotal += detail.quantity;
					acc.transporterQty++;
				}
				return acc;
			},
			{ transporterTotal: 0, recuperatorTotal: 0, transporterQty: 0, recuperatorQty: 0 }
		);

		const isConfirmed = transporterTotal === recuperatorTotal && transporterQty === recuperatorQty;

		return { transporterTotal, recuperatorTotal, isConfirmed };
	}

	async updateInFavorRecuperator({ id, key }: { id: number; key: string }): Promise<void> {
		const auditGuide = await this.auditGuideRepository.findOne({ where: { id } });

		if (!auditGuide) {
			throw new BusinessException('No se encontró la auditoría especificada.', 404);
		}

		if (+auditGuide.requestStatusId !== AUDIT_GUIDE_STATUS.BY_CONCILLIATE) {
			throw new BusinessException('La auditoría debe estar en estado pendiente para actualizar.');
		}

		auditGuide.inFavorRecuperator = key === 'R';

		await this.auditGuideRepository.save(auditGuide);
	}

	async checkAndSyncAuditGuides(transporterTravels: TransporterTravel[]): Promise<void> {
		const queryRunner = this.auditGuideRepository.manager.connection.createQueryRunner();
		await queryRunner.startTransaction();

		try {
			const guidesNumber = transporterTravels.map(({ guideId }) => guideId.toString().toUpperCase());

			const auditsGuides = await this.auditGuideRepository.find({
				where: { guideNumber: In(guidesNumber), requestStatusId: AUDIT_GUIDE_STATUS.WITHOUT_GUIDE },
			});

			if (auditsGuides.length === 0) {
				return;
			}

			for (const auditGuide of auditsGuides) {
				const transporterTravel = transporterTravels.find(
					(element) => element.guideId === auditGuide.guideNumber
				);

				if (!transporterTravel) { continue; }

				const { transporterTotal, recuperatorTotal, isConfirmed } = await this.syncAuditDetails(
					queryRunner,
					auditGuide,
					transporterTravel
				);

				const zone = await this.childrensRepository.findOne({ where: { name: transporterTravel.zone.toUpperCase() } });
				if (!zone) { continue; }

				await queryRunner.manager.update(
					AuditGuide,
					auditGuide.id,
					{
						transporterTotal,
						recuperatorTotal,
						date: transporterTravel.movementDate,
						zoneId: zone.id,
						requestStatusId: isConfirmed ? AUDIT_GUIDE_STATUS.CONFIRMED : AUDIT_GUIDE_STATUS.BY_CONCILLIATE,
						modifiedBy: this.userContextService.getUserDetails()?.id,
					}
				);

				const auditGuideRoute = this.auditGuideRouteRepository.create({
					auditGuide,
					transporterTravel,
					createdBy: this.userContextService.getUserDetails()?.id,
					updatedBy: this.userContextService.getUserDetails()?.id,
				});

				await queryRunner.manager.save(auditGuideRoute);
			}

			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw new BusinessException(`Error al sincronizar guías de auditoría: ${error.message}`);
		} finally {
			await queryRunner.release();
		}
	}

	async updateGuideNumber(guideNumber: string, newGuideNumber: string): Promise<void> {
		const auditGuide = await this.auditGuideRepository.findOne({ where: { guideNumber } });

		if (!auditGuide) {
			throw new BusinessException('No se encontró la auditoría especificada.', 404);
		}

		if (![AUDIT_GUIDE_STATUS.TRANSIT, AUDIT_GUIDE_STATUS.WITHOUT_GUIDE].includes(+auditGuide.requestStatusId)) {
			throw new BusinessException('La auditoría no se puede actualizar.');
		}

		auditGuide.guideNumber = newGuideNumber;

		await this.auditGuideRepository.save(auditGuide);
	}

	async createByTransporter(transporterTravels: TransporterTravel[]): Promise<void> {
		const queryRunner = this.auditGuideRepository.manager.connection.createQueryRunner();
		await queryRunner.startTransaction();

		try {
			for (const transporterTravel of transporterTravels) {
				const _auditGuide = await this.auditGuideRepository.findOne({
					where: { guideNumber: transporterTravel.guideId },
				});

				if (_auditGuide) {
					await this.checkAndSyncAuditGuides([transporterTravel]);
					continue;
				}

				let { date, zoneId, auditGuideDetails, transporterTotal } = await this.handleTransporterTravel(
					transporterTravel,
					[],
					0
				);

				const auditGuide = this.auditGuideRepository.create({
					reception: null,
					guideNumber: transporterTravel.guideId,
					date,
					zoneId,
					recuperatorId: null,
					transporterId: null,
					recuperatorTotal: 0,
					transporterTotal,
					requestStatusId: AUDIT_GUIDE_STATUS.TRANSIT,
				});

				const auditGuideSaved = await queryRunner.manager.save(auditGuide);
				if (!auditGuideSaved.id) {
					throw new BusinessException('Error al guardar la guía de auditoría.', 500);
				}

				const productIds = auditGuideDetails.map((item) => item.productId);
				const products = await this.productRepository.findBy({ id: In(productIds) });
				const productMap = new Map(products.map((product) => [product.id, product]));
				auditGuideDetails = auditGuideDetails.map((item) => ({
					...item,
					product: productMap.get((item.productId).toString() as any),
				}));

				await this.saveAuditDetails(queryRunner, auditGuideDetails, auditGuideSaved);

				await this.saveAuditRoute(queryRunner, auditGuideSaved, transporterTravel, null);
			}

			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw new BusinessException(error.message || 'Error inesperado en la creación de la auditoría.', 500);
		} finally {
			await queryRunner.release();
		}
	}
}
