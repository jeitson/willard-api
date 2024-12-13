import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportsPh } from './entities/reports_ph.entity';
import { Repository, Like } from 'typeorm';
import { ReportCreateDto, ReportQueryDto, ReportUpdateDto } from './dto/reports_ph.dto';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { ClientsService } from '../clients/clients.service';
import { ProductsService } from '../products/products.service';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { UserContextService } from '../users/user-context.service';

@Injectable()
export class ReportsPhService {
	constructor(
		@InjectRepository(ReportsPh)
		private readonly reportsRepository: Repository<ReportsPh>,
		private readonly clientsService: ClientsService,
		private readonly productsService: ProductsService,
		private readonly userContextService: UserContextService
	) { }

	async create(createReportDto: ReportCreateDto): Promise<ReportsPh> {
		const client = await this.clientsService.findOne(createReportDto.clientId);
		if (!client) {
			throw new BusinessException('El cliente especificado no existe.');
		}

		const product = await this.productsService.findOne(createReportDto.productId);
		if (!product) {
			throw new BusinessException('El producto especificado no existe.');
		}

		const user_id = this.userContextService.getUserDetails().id;

		const report = this.reportsRepository.create({ ...createReportDto, client, product, createdBy: user_id, modifiedBy: user_id });
		return await this.reportsRepository.save(report);
	}

	async update(id: number, updateReportDto: ReportUpdateDto): Promise<ReportsPh> {
		const report = await this.reportsRepository.findOne({ where: { id } });

		if (!report) {
			throw new BusinessException('Reporte no encontrado.');
		}

		if (updateReportDto.clientId) {
			const client = await this.clientsService.findOne(updateReportDto.clientId);
			if (!client) {
				throw new BusinessException('El cliente especificado no existe.');
			}
		}

		if (updateReportDto.productId) {
			const product = await this.productsService.findOne(updateReportDto.productId);
			if (!product) {
				throw new BusinessException('El producto especificado no existe.');
			}
		}

		const modifiedBy = this.userContextService.getUserDetails().id;

		return await this.reportsRepository.save({ ...report, ...updateReportDto, modifiedBy });
	}

	async findAll(query: ReportQueryDto): Promise<Pagination<ReportsPh>> {
		const queryBuilder = this.reportsRepository.createQueryBuilder('report');

		if (query.guideNumber) {
			queryBuilder.andWhere('report.guideNumber LIKE :guideNumber', { guideNumber: `%${query.guideNumber}%` });
		}

		if (query.clientId) {
			queryBuilder.andWhere('report.clientId = :clientId', { clientId: query.clientId });
		}

		if (query.productId) {
			queryBuilder.andWhere('report.productId = :productId', { productId: query.productId });
		}

		if (query.collectionSiteId) {
			queryBuilder.andWhere('report.collectionSiteId = :collectionSiteId', { collectionSiteId: query.collectionSiteId });
		}

		return paginate<ReportsPh>(queryBuilder, { page: query.page, pageSize: query.pageSize });
	}

	async findOne(id: number): Promise<ReportsPh> {
		const report = await this.reportsRepository.findOne({ where: { id } });

		if (!report) {
			throw new BusinessException('Reporte no encontrado.');
		}

		return report;
	}

	async remove(id: number): Promise<void> {
		const report = await this.findOne(id);
		await this.reportsRepository.remove(report);
	}

	async findByCollectionSite(referenciasPh: string[]): Promise<any> {
		if (!Array.isArray(referenciasPh) || referenciasPh.length === 0) {
			throw new BusinessException('Debe proporcionar un array de referencias PH.');
		}

		const reports = await this.reportsRepository
			.createQueryBuilder('report')
			.innerJoinAndSelect('report.client', 'client')
			.innerJoinAndSelect('report.product', 'product')
			.innerJoinAndSelect('report.collectionSite', 'collectionSite')
			.where('collectionSite.referencePH IN (:...referenciasPh)', { referenciasPh })
			.getMany();

		const ids = reports.map((report) => report.id);
		await this.reportsRepository
			.createQueryBuilder()
			.update(ReportsPh)
			.set({ consulted: true })
			.where('id IN (:...ids)', { ids })
			.execute();

		const groupedReports = reports.reduce((acc, report) => {
			const collectionSiteId = report.collectionSite.id;
			if (!acc[collectionSiteId]) {
				acc[collectionSiteId] = {
					agenciaId: collectionSiteId,
					agenciaReferenciaWillard: report.collectionSite.referenceWLL,
					agenciaReferenciaPh: report.collectionSite.referencePH,
					reportes: [],
				};
			}

			acc[collectionSiteId].reportes.push({
				nit: report.client.documentNumber,
				referenciaWillard: report.client.referenceWLL,
				referenciaPh: report.client.referencePH,
				producto: {
					referenciaWillard: report.product.referenceWLL,
					referenciaPh: report.product.referencePH,
				},
				auditoria: {
					fecha: report.date,
					cantidad: report.quantityProduct,
					guia: report.guideNumber,
				},
			});
			return acc;
		}, {});

		return Object.values(groupedReports);
	}
}
