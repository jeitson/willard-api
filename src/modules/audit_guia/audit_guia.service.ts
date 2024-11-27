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

// TODO: Actualizar los ids de los estados
/** Estados ID
 * 1 = Sin GUIA
 * 2 = Pendiente
 * 3 = Confirmado
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

	private createBaseQueryBuilder() {
		// return this.auditGuiaRepository.createQueryBuilder('collectionRequest')
		// 	.leftJoinAndSelect('collectionRequest.client', 'client')
		// 	.leftJoinAndSelect('collectionRequest.pickUpLocation', 'pickUpLocation')
		// 	.leftJoinAndSelect('collectionRequest.collectionSite', 'collectionSite')
		// 	.leftJoinAndSelect('collectionRequest.driver', 'driver')
		// 	.leftJoinAndSelect('collectionRequest.transporter', 'transporter')
		// 	.leftJoinAndSelect('collectionRequest.user', 'user')
		// 	.leftJoinAndSelect('collectionRequest.audits', 'audits')
		// 	.leftJoinAndSelect('collectionRequest.route', 'route')
		// 	.leftJoinAndMapOne('collectionRequest.productType', Child, 'productType', 'productType.id = collectionRequest.productTypeId')
		// 	.leftJoinAndMapOne('collectionRequest.motiveSpecial', Child, 'motiveSpecial', 'motiveSpecial.id = collectionRequest.motiveSpecialId')
		// 	.leftJoinAndMapOne('collectionRequest.requestStatusId', Child, 'requestStatus', 'requestStatus.id = collectionRequest.requestStatusId');
	}

	async create(createAuditGuiaDto: AuditGuiaCreateDto): Promise<void> {
		const { id: user_id } = this.userContextService.getUserDetails();
		let { auditGuiaDetails, transporterTotal, ...auditGuiaData } = createAuditGuiaDto;

		const queryRunner = this.auditGuiaRepository.manager.connection.createQueryRunner();
		await queryRunner.startTransaction();

		try {
			let requestStatusId = 1;
			let zoneId = null;
			let date = null;

			// Verificar si existe un transporterTravel relacionado con la guía
			const transporterTravel = await this.transporterTravelRepository.findOne({
				where: { guideId: createAuditGuiaDto.guideNumber.toUpperCase() },
				relations: ['details'],
			});

			if (transporterTravel) {
				requestStatusId = 2; // Cambiar el estado si existe transporterTravel
				date = transporterTravel.movementDate;

				// Buscar la zona relacionada
				const zone = await this.catalogsService.getChildrenByName(transporterTravel.zone);
				if (!zone) {
					throw new BusinessException(`No existe la zona configurada para la guía`, 400);
				}
				zoneId = zone[0].id;

				// Validar los productos en transporterTravel
				const productNames = transporterTravel.details.map((item) => item.batteryType);
				const foundProducts = await this.productRepository.find({ where: { name: In(productNames) } });

				if (!foundProducts.length || foundProducts.length !== productNames.length) {
					throw new BusinessException(
						`Verifique los productos ingresados: ${productNames.join(', ')}`,
					);
				}

				// Crear los detalles basados en transporterTravel
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
			}

			const auditGuia = this.auditGuiaRepository.create({
				...auditGuiaData,
				zoneId,
				date,
				transporterTotal,
				requestStatusId,
				createdBy: user_id,
				modifiedBy: user_id,
			});

			const auditGuiaSaved = await queryRunner.manager.save(auditGuia);

			if (!auditGuiaSaved.id) {
				throw new BusinessException('Error al guardar la guía de auditoría.', 500);
			}

			const detailsToSave = [];
			for (const detail of auditGuiaDetails) {
				const product = await this.productRepository.findOneBy({ id: detail.productId });
				if (!product) {
					throw new BusinessException(`Producto con ID ${detail.productId} no encontrado.`, 400);
				}

				if (detail.quantity <= 0 || detail.quantityCollection < 0) {
					throw new BusinessException('La cantidad y la cantidad corregida deben ser números positivos.', 400);
				}

				const auditGuiaDetail = this.auditGuiaDetailRepository.create({
					...detail,
					product,
					auditGuia: auditGuiaSaved,
				});

				detailsToSave.push(auditGuiaDetail);
			}

			await queryRunner.manager.save(AuditGuiaDetail, detailsToSave);

			if (transporterTravel) {
				const auditGuiaRoute = this.auditGuiaRouteRepository.create({
					auditGuia: auditGuiaSaved,
					transporterTravel,
					createdBy: user_id,
					updatedBy: user_id,
				});

				await queryRunner.manager.save(auditGuiaRoute);
			}

			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}


	async updateDetails(id: number, { auditGuiaDetails: detailsToUpdate }: AuditGuiaDetailUpdateDto): Promise<void> {
		const auditGuia = await this.auditGuiaRepository.findOne({
			where: { id },
		});

		if (!auditGuia) {
			throw new BusinessException(
				`No se encontró la auditoría con el ID ${id}`,
			);
		}

		if (auditGuia.requestStatusId !== 2) {
			throw new BusinessException(
				`La auditoría no aplica para realizar esta acción`,
			);
		}

		let transporterTotal = 0, recuperatorTotal = 0;

		for (const detail of detailsToUpdate) {
			const existingDetail = await this.auditGuiaDetailRepository.findOne({
				where: { id: detail.id },
			});

			if (!existingDetail) {
				throw new BusinessException(
					`No se encontró el detalle de auditoría con el ID ${detail.id}`,
				);
			}

			existingDetail.quantityCollection = detail.quantityCollection;

			await this.auditGuiaDetailRepository.save(existingDetail);

			if (existingDetail.isRecuperator) {
				recuperatorTotal += detail.quantityCollection;
			} else {
				transporterTotal += detail.quantityCollection;
			}
		}

		auditGuia.recuperatorTotal = recuperatorTotal;
		auditGuia.transporterTotal = transporterTotal;

		await this.auditGuiaRepository.save(auditGuia);

	}

	async updateInFavorRecuperator({ id, key }: { id: number, key: 'R' | 'T' }): Promise<void> {
		const auditGuia = await this.auditGuiaRepository.findOne({
			where: { id },
		});

		if (!auditGuia) {
			throw new BusinessException(
				`No se encontró la auditoría con el ID ${id}`,
			);
		}

		if (auditGuia.requestStatusId !== 2) {
			throw new BusinessException(
				`La auditoría no aplica para realizar esta acción`,
			);
		}

		auditGuia.inFavorRecuperator = key === 'R';

		await this.auditGuiaDetailRepository.save(auditGuia);
	}

	async confirm(id: number): Promise<void> {
		const auditGuia = await this.auditGuiaRepository.findOne({
			where: { id },
		});

		if (!auditGuia) {
			throw new BusinessException(
				`No se encontró la auditoría con el ID ${id}`,
			);
		}

		if (auditGuia.requestStatusId !== 2) {
			throw new BusinessException(
				`La auditoría no aplica para realizar esta acción`,
			);
		}

		auditGuia.requestStatusId = 3;

		await this.auditGuiaDetailRepository.save(auditGuia);
	}

	async findOne(id: string): Promise<AuditGuia> {
		return this.auditGuiaRepository.findOne({
			where: { id: +id },
			relations: ['auditGuiaDetails', 'auditsGuiasRoutes'],
		});
	}

	async findAll(): Promise<AuditGuia[]> {
		return this.auditGuiaRepository.find({
			relations: ['auditGuiaDetails', 'auditsGuiasRoutes'],
		});
	}
}
