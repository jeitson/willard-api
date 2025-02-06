import { Injectable, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { excelDateToJSDate, excelTimeToJSDate } from 'src/core/utils';
import { TransporterTravel } from './entities/transporter_travel.entity';
import { TransporterTravelDto } from './dto/transporter_travel.dto';
import { Product } from '../products/entities/product.entity';
import { Child } from '../catalogs/entities/child.entity';
import { ResponseCodeTransporterTravel } from './entities/response';
import { AuditGuideService } from '../audit_guide/audit_guide.service';

@Injectable()
export class TransporterTravelService {
	constructor(
		@InjectRepository(TransporterTravel)
		private readonly transporterTravelRepository: Repository<TransporterTravel>,
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,
		@InjectRepository(Child)
		private readonly childrensRepository: Repository<Child>,
		private readonly auditGuideService: AuditGuideService,
	) { }

	async createFromJson(data: TransporterTravelDto): Promise<ResponseCodeTransporterTravel[]> {
		const travelRecordDto = plainToClass(TransporterTravelDto, data);
		const errors = await validate(travelRecordDto);
		if (errors.length > 0) {
			const errorMessages = errors.map((error) => ({
				property: error.property,
				errors: Object.values(error.constraints || {}),
			}));
			throw new UnprocessableEntityException({
				message: 'Validation failed',
				errors: errorMessages,
			});
		}

		try {
			const item = this.mapRowToTransporterTravelDto(data);
			item.details = this.convertDetail(data.detalles);

			await this.validateAllRecords([item]);

			if (item.guidePreviousId) {
				await this.updateTransporterTravel(item);
			} else {
				const travelRecord = this.transporterTravelRepository.create(item);
				const savedRecord = await this.transporterTravelRepository.save(travelRecord);

				this.auditGuideService.checkAndSyncAuditGuides(savedRecord);

				return savedRecord.map(({ type, id }) => ({ codigoSolicitud: `${type.slice(0, 3).toUpperCase()}${id}` }));
			}
		} catch (error) {
			throw new BusinessException('Error al procesar el objeto JSON: ' + error.message);
		}
	}

	async createFromExcel(file: any): Promise<ResponseCodeTransporterTravel[]> {
		try {
			const workbook = XLSX.read(file.buffer, { type: 'buffer' });
			const mainSheetName = workbook.SheetNames[0];
			const mainSheet = workbook.Sheets[mainSheetName];
			const mainData = XLSX.utils.sheet_to_json(mainSheet);
			const detailSheetName = workbook.SheetNames[1];
			const detailSheet = workbook.Sheets[detailSheetName];
			const detailData = XLSX.utils.sheet_to_json(detailSheet);

			const recordsToCreate = [];
			const recordsToUpdate = [];
			const validationErrors = [];

			// Agrupar detalles por guía
			const detailsByGuide = detailData.reduce((acc, detail) => {
				const idGuia = detail['idGuia'];
				if (!acc[idGuia]) {
					acc[idGuia] = [];
				}
				acc[idGuia].push({
					tipoBat: detail['tipoBat'],
					cantidad: detail['cantidad'],
				});
				return acc;
			}, {});

			// Procesar cada fila del archivo principal
			for (const [index, row] of mainData.entries()) {
				row['fechaMov'] = excelDateToJSDate(row['fechaMov']);
				row['horaMov'] = excelTimeToJSDate(row['horaMov']);
				const record = this.mapRowToTransporterTravelDto(row);
				const details = detailsByGuide[record.guideId] || [];
				record.details = this.convertDetail(details);

				// Validar que el registro tenga al menos un detalle
				if (!record.details || record.details.length === 0) {
					validationErrors.push({
						row: index + 1,
						errors: ['El registro debe tener al menos un detalle.'],
					});
					continue;
				}

				// Separar registros para creación y actualización
				if (record.guidePreviousId) {
					recordsToUpdate.push(record);
				} else {
					recordsToCreate.push(record);
				}
			}

			// Validar todos los registros antes de proceder
			await this.validateAllRecords([...recordsToCreate, ...recordsToUpdate]);

			// Procesar actualizaciones
			for (const record of recordsToUpdate) {
				await this.updateTransporterTravel(record);
			}

			// Procesar creaciones
			const savedRecords = await this.transporterTravelRepository.save(recordsToCreate);

			// Combinar resultados de creación y actualización
			const allSavedRecords = [
				...savedRecords,
				...recordsToUpdate.map((record) => ({ type: record.type, id: record.guidePreviousId })),
			];

			this.auditGuideService.checkAndSyncAuditGuides(allSavedRecords);

			return allSavedRecords.map(({ type, id }) => ({ codigoSolicitud: `${type.slice(0, 3).toUpperCase()}${id}` }));
		} catch (error) {
			throw new BadRequestException('Error al procesar el archivo Excel: ' + error.message);
		}
	}

	private mapRowToTransporterTravelDto(row: any): any {
		return {
			routeId: row['idRuta'],
			guideId: row['idGuia'],
			guidePreviousId: row['idGuiaAntes'],
			type: row['tipo'],
			sequence: row['secuencia'],
			movementDate: row['fechaMov'],
			movementTime: row['horaMov'],
			planner: row['planeador'],
			zone: row['zona'],
			city: row['ciudad'],
			department: row['depto'],
			licensePlate: row['placa'],
			driver: row['conductor'],
			siteName: row['nombreSitio'],
			address: row['direccion'],
			gpsPosition: row['posGps'],
			totalQuantity: row['totCant'],
			referenceDocument: row['docReferencia'],
			referenceDocument2: row['docReferencia2'],
			supportUrls: row['urlSoportes'] || [],
			details: [],
		};
	}

	private convertDetail(details: any): any[] {
		return details.map((d) => ({
			batteryType: d.tipoBat.toUpperCase(),
			quantity: d.cantidad,
		})) || [];
	}

	private async updateTransporterTravel(item: any): Promise<void> {
		const existingRecord = await this.transporterTravelRepository.findOne({
			where: { guideId: item.guidePreviousId },
		});

		if (!existingRecord) {
			throw new BusinessException(`No se encontró ningún registro con idGuiaAntes: ${item.guidePreviousId}`);
		}

		// Validar el registro antes de proceder
		await this.validateAllRecords([item]);

		// Actualizar campos
		existingRecord.routeId = item.routeId;
		existingRecord.guideId = item.guideId;
		existingRecord.type = item.type;
		existingRecord.sequence = item.sequence;
		existingRecord.movementDate = item.movementDate;
		existingRecord.movementTime = item.movementTime;
		existingRecord.planner = item.planner;
		existingRecord.zone = item.zone;
		existingRecord.city = item.city;
		existingRecord.department = item.department;
		existingRecord.licensePlate = item.licensePlate;
		existingRecord.driver = item.driver;
		existingRecord.siteName = item.siteName;
		existingRecord.address = item.address;
		existingRecord.gpsPosition = item.gpsPosition;
		existingRecord.totalQuantity = item.totalQuantity;
		existingRecord.referenceDocument = item.referenceDocument;
		existingRecord.referenceDocument2 = item.referenceDocument2;
		existingRecord.supportUrls = item.supportUrls;

		// Actualizar detalles
		existingRecord.details = this.convertDetail(item.details);

		const updatedRecord = await this.transporterTravelRepository.save(existingRecord);

		this.auditGuideService.checkAndSyncAuditGuides([updatedRecord]);
	}

	private async validateAllRecords(records: any[]): Promise<void> {
		const validationErrors = [];

		// Validar que todos los registros tengan al menos un detalle
		for (const [index, record] of records.entries()) {
			if (!record.details || record.details.length === 0) {
				validationErrors.push({
					row: index + 1,
					errors: ['El registro debe tener al menos un detalle.'],
				});
			}
		}

		// Validar productos
		const productNames = records.flatMap((record) =>
			record.details.map((detail) => detail.batteryType.toUpperCase())
		);
		const foundProducts = await this.productRepository.find({ where: { name: In(productNames) } });
		if (foundProducts.length !== productNames.length) {
			validationErrors.push({
				row: 'Global',
				errors: [`Algunos productos no existen: ${productNames.join(', ')}`],
			});
		}

		// Validar zonas
		const zones = records.map((record) => record.zone.toUpperCase());
		const foundZones = await this.childrensRepository.find({ where: { name: In(zones) } });
		if (foundZones.length !== zones.length) {
			validationErrors.push({
				row: 'Global',
				errors: [`Algunas zonas no existen: ${zones.join(', ')}`],
			});
		}

		// Lanzar errores si hay problemas
		if (validationErrors.length > 0) {
			throw new UnprocessableEntityException({
				message: 'Error de validación en una o más filas',
				errors: validationErrors,
			});
		}
	}
}
