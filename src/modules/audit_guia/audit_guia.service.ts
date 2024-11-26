import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditGuiaCreateDto } from './dto/audit_guia.dto';
import { AuditGuia } from './entities/audit_guia.entity';
import { AuditGuiaDetail } from './entities/audit_guia_detail.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { UserContextService } from '../users/user-context.service';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { AuditGuiaRoute } from './entities/audit_guia-ruta.entity';
import { TransporterTravel } from '../transporter_travel/entities/transporter_travel.entity';

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

	async create(createAuditGuiaDto: AuditGuiaCreateDto): Promise<AuditGuia> {
		const { id: user_id } = this.userContextService.getUserDetails();
		const { auditGuiaDetails, ...auditGuiaData } = createAuditGuiaDto;

		const queryRunner = this.auditGuiaRepository.manager.connection.createQueryRunner();
		await queryRunner.startTransaction();

		try {
			// TODO: Actualizar a los ids correctos
			let requestStatusId = 1;

			let transporterTravel;
			const _transporterTravel = await this.transporterTravelRepository.findOneBy({ guideId: createAuditGuiaDto.guideNumber.toUpperCase() });
			if (_transporterTravel) {
				transporterTravel = _transporterTravel;
				requestStatusId = 2;
			}

			const auditGuia = this.auditGuiaRepository.create({
				...auditGuiaData,
				requestStatusId,
				createdBy: user_id,
				modifiedBy: user_id,
			});

			const auditGuiaSave = await queryRunner.manager.save(auditGuia);

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
					auditGuia: auditGuiaSave,
				});

				detailsToSave.push(auditGuiaDetail);
			}

			await queryRunner.manager.save(AuditGuiaDetail, detailsToSave);

			await queryRunner.commitTransaction();

			if (_transporterTravel) {
				await this.auditGuiaRouteRepository.save({
					auditGuia: auditGuiaSave,
					transporterTravel: _transporterTravel,
					createdBy: user_id,
					updatedBy: user_id,
				});
			}

			return this.auditGuiaRepository.findOne({
				where: { id: auditGuia.id },
				relations: ['auditGuiaDetails', 'auditGuiaDetails.product', 'auditsGuiasRoutes'],
			});
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
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
