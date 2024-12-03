import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AuditGuiaCreateDto, AuditGuiaDetailUpdateDto } from './dto/audit_guia.dto';
import { AuditGuia } from './entities/audit_guia.entity';
import { AuditGuiaDetail } from './entities/audit_guia_detail.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { UserContextService } from '../users/user-context.service';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { AuditGuiaRoute } from './entities/audit_guia-ruta.entity';
import { TransporterTravel } from '../transporter_travel/entities/transporter_travel.entity';
import { CatalogsService } from '../catalogs/catalogs.service';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { Child } from '../catalogs/entities/child.entity';

// TODO: Actualizar los ids de los estados
/** Estados ID
 * 101 = Sin GUIA
 * 102 = Pendiente
 * 103 = Confirmado
 *  **/

@Injectable()
export class AuditGuiaService {
	constructor(
		@InjectRepository(AuditGuia)
		private readonly auditGuiaRepository: Repository<AuditGuia>,

		@InjectRepository(AuditGuiaDetail)
		private readonly auditGuiaDetailRepository: Repository<AuditGuiaDetail>,

		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,

		private readonly userContextService: UserContextService,

		@InjectRepository(AuditGuiaRoute)
		private readonly auditGuiaRouteRepository: Repository<AuditGuiaRoute>,

		@InjectRepository(TransporterTravel)
		private readonly transporterTravelRepository: Repository<TransporterTravel>,

		private readonly catalogsService: CatalogsService,
	) { }

	async create(createAuditGuiaDto: AuditGuiaCreateDto): Promise<void> {
		const { id: userId } = this.userContextService.getUserDetails();
		let { auditGuiaDetails, transporterTotal, ...auditGuiaData } = createAuditGuiaDto;

		const queryRunner = this.auditGuiaRepository.manager.connection.createQueryRunner();
		await queryRunner.startTransaction();

		try {
			let requestStatusId = 101;
			let zoneId = null;
			let date = null;

			const transporterTravel = await this.transporterTravelRepository.findOne({
				where: { guideId: createAuditGuiaDto.guideNumber.toUpperCase() },
				relations: ['details'],
			});

			if (transporterTravel) {
				({ requestStatusId, date, zoneId, auditGuiaDetails, transporterTotal } = await this.handleTransporterTravel(
					transporterTravel,
					auditGuiaDetails,
					transporterTotal,
				));
			}

			const auditGuia = this.auditGuiaRepository.create({
				...auditGuiaData,
				zoneId,
				date,
				transporterTotal,
				requestStatusId,
				createdBy: userId,
				modifiedBy: userId,
			});

			const auditGuiaSaved = await queryRunner.manager.save(auditGuia);
			if (!auditGuiaSaved.id) {
				throw new BusinessException('Error al guardar la guía de auditoría.', 500);
			}

			await this.saveAuditDetails(queryRunner, auditGuiaDetails, auditGuiaSaved);

			if (transporterTravel) {
				await this.saveAuditRoute(queryRunner, auditGuiaSaved, transporterTravel, userId);
			}

			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}

	async updateDetails(id: number, updateDto: AuditGuiaDetailUpdateDto): Promise<void> {
		const auditGuia = await this.findAuditGuiaById(id);
		if (auditGuia.requestStatusId !== 102) {
			throw new BusinessException('La auditoría no aplica para realizar esta acción.');
		}

		const { transporterTotal, recuperatorTotal } = await this.updateAuditDetails(updateDto);

		auditGuia.transporterTotal = transporterTotal;
		auditGuia.recuperatorTotal = recuperatorTotal;
		await this.auditGuiaRepository.save(auditGuia);
	}

	async confirm(id: number): Promise<void> {
		const auditGuia = await this.findAuditGuiaById(id);
		if (auditGuia.requestStatusId !== 102) {
			throw new BusinessException('La auditoría no aplica para realizar esta acción.');
		}

		auditGuia.requestStatusId = 103;
		await this.auditGuiaRepository.save(auditGuia);
	}

	async findOne(id: string): Promise<AuditGuia> {
		return this.auditGuiaRepository.findOne({
			where: { id: +id },
			relations: ['auditGuiaDetails', 'auditsGuiasRoutes', 'reception', 'transporterTravel'],
		});
	}

	async findAll(query: any): Promise<Pagination<AuditGuia>> {
		const queryBuilder = this.auditGuiaRepository.createQueryBuilder('auditGuia')
			.leftJoinAndSelect('auditGuia.auditGuiaDetails', 'auditGuiaDetails')
			.leftJoinAndSelect('auditGuia.reception', 'reception')
			.leftJoinAndSelect('auditGuia.auditsGuiasRoutes', 'auditsGuiasRoutes')
			.leftJoinAndSelect('auditsGuiasRoutes.transporterTravel', 'transporterTravel')
			.leftJoinAndMapOne('auditGuia.requestStatusId', Child, 'requestStatus', 'requestStatus.id = auditGuia.requestStatusId')
			.leftJoinAndMapOne('auditGuia.zoneId', Child, 'zone', 'zone.id = auditGuia.zoneId');

		return paginate<AuditGuia>(queryBuilder, {
			page: query.page,
			pageSize: query.pageSize,
		});
	}

	private async handleTransporterTravel(
		transporterTravel: TransporterTravel,
		auditGuiaDetails: any[],
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

		auditGuiaDetails.push(...transporterDetails);

		return {
			requestStatusId: 102,
			date: transporterTravel.movementDate,
			zoneId: zone[0].id,
			auditGuiaDetails,
			transporterTotal,
		};
	}

	private async saveAuditDetails(queryRunner, details: any[], auditGuiaSaved: AuditGuia) {
		const detailsToSave = details.map((detail) =>
			this.auditGuiaDetailRepository.create({
				...detail,
				auditGuia: auditGuiaSaved,
			}),
		);
		await queryRunner.manager.save(AuditGuiaDetail, detailsToSave);
	}

	private async saveAuditRoute(queryRunner, auditGuia: AuditGuia, transporterTravel: TransporterTravel, userId: number) {
		const auditGuiaRoute = this.auditGuiaRouteRepository.create({
			auditGuia,
			transporterTravel,
			createdBy: userId.toString(),
			updatedBy: userId.toString(),
		});
		await queryRunner.manager.save(auditGuiaRoute);
	}

	private async findAuditGuiaById(id: number): Promise<AuditGuia> {
		const auditGuia = await this.auditGuiaRepository.findOne({ where: { id } });
		if (!auditGuia) {
			throw new BusinessException(`No se encontró la auditoría con el ID ${id}`);
		}
		return auditGuia;
	}

	private async updateAuditDetails(updateDto: AuditGuiaDetailUpdateDto) {
		let transporterTotal = 0;
		let recuperatorTotal = 0;

		for (const detail of updateDto.auditGuiaDetails) {
			const existingDetail = await this.auditGuiaDetailRepository.findOne({ where: { id: detail.id } });
			if (!existingDetail) {
				throw new BusinessException(`No se encontró el detalle de auditoría con el ID ${detail.id}`);
			}

			existingDetail.quantityCollection = detail.quantityCollection;
			await this.auditGuiaDetailRepository.save(existingDetail);

			if (existingDetail.isRecuperator) {
				recuperatorTotal += existingDetail.quantityCollection;
			} else {
				transporterTotal += existingDetail.quantityCollection;
			}
		}

		return { transporterTotal, recuperatorTotal };
	}

	async synchronize(id: number): Promise<void> {
		const auditGuia = await this.findAuditGuiaById(id);

		if (auditGuia.requestStatusId !== 101) {
			throw new BusinessException('Solo se pueden sincronizar auditorías en estado "sin guia".');
		}

		const queryRunner = this.auditGuiaRepository.manager.connection.createQueryRunner();
		await queryRunner.startTransaction();

		try {
			const externalData = await this.fetchExternalData();
			if (!externalData) {
				throw new BusinessException('No se encontraron datos externos para sincronizar.', 404);
			}

			const { transporterTotal, recuperatorTotal } = await this.syncAuditDetails(queryRunner, auditGuia, externalData);

			auditGuia.transporterTotal = transporterTotal;
			auditGuia.recuperatorTotal = recuperatorTotal;
			auditGuia.requestStatusId = 102;

			await queryRunner.manager.save(auditGuia);

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

	private async syncAuditDetails(queryRunner, auditGuia: AuditGuia, externalData: any): Promise<any> {
		let transporterTotal = 0;
		let recuperatorTotal = 0;

		const productNames = externalData.details.map((item) => item.productName);
		const foundProducts = await this.productRepository.find({ where: { name: In(productNames) } });
		if (foundProducts.length !== productNames.length) {
			throw new BusinessException('No se pudieron validar todos los productos de los datos externos.');
		}

		const detailsToSave = foundProducts.map((product) => {
			const { quantity } = externalData.details.find(({ productName }) => productName === product.name);

			return this.auditGuiaDetailRepository.create({
				auditGuia,
				product,
				isRecuperator: false,
				quantity,
				quantityCollection: quantity,
			});
		});

		await queryRunner.manager.save(AuditGuiaDetail, detailsToSave);

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
		const auditGuia = await this.auditGuiaRepository.findOne({ where: { id } });

		if (!auditGuia) {
			throw new BusinessException('No se encontró la auditoría especificada.', 404);
		}

		if (auditGuia.requestStatusId !== 102) {
			throw new BusinessException('La auditoría debe estar en estado pendiente para actualizar.');
		}

		auditGuia.inFavorRecuperator = key === 'R';

		await this.auditGuiaRepository.save(auditGuia);
	}


}
