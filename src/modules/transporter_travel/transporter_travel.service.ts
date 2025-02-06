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

@Injectable()
export class TransporterTravelService {
	constructor(
		@InjectRepository(TransporterTravel)
		private readonly transporterTravelRepository: Repository<TransporterTravel>,
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,
		@InjectRepository(Child)
		private readonly childrensRepository: Repository<Child>,
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

			// Validar que el registro tenga al menos un detalle
			if (!item.details || item.details.length === 0) {
				throw new BusinessException('Todos los registros deben tener al menos un detalle.');
			}

			// Verificar si es una actualización
			if (item.guidePreviousId) {
				await this.updateTransporterTravel(item);
			} else {
				await this.validateRelations([item]);
				const travelRecord = this.transporterTravelRepository.create(item);
				const savedRecord = await this.transporterTravelRepository.save(travelRecord);
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

			const records = [];
			const validationErrors = [];
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

			for (const [index, row] of mainData.entries()) {
				row['fechaMov'] = excelDateToJSDate(row['fechaMov']);
				row['horaMov'] = excelTimeToJSDate(row['horaMov']);
				const record = this.mapRowToTransporterTravelDto(row);
				const details = detailsByGuide[record.guideId] || [];
				record.details = this.convertDetail(details);

				if (!record.details || record.details.length === 0) {
					validationErrors.push({
						row: index + 1,
						errors: ['El registro debe tener al menos un detalle.'],
					});
					continue;
				}

				const errors = await validate(record);
				if (errors.length > 0) {
					const errorMessages = errors.map((error) => ({
						property: error.property,
						errors: Object.values(error.constraints || {}),
					}));
					validationErrors.push({
						row: index + 1,
						errors: errorMessages,
					});
				} else {
					if (record.guidePreviousId) {
						await this.updateTransporterTravel(record);
					} else {
						records.push(this.transporterTravelRepository.create(record));
					}
				}
			}

			if (validationErrors.length > 0) {
				throw new UnprocessableEntityException({
					message: 'Error de validación en una o más filas',
					errors: validationErrors,
				});
			}

			await this.validateRelations(records);
			const savedRecord = await this.transporterTravelRepository.save(records);
			return savedRecord.map(({ type, id }) => ({ codigoSolicitud: `${type.slice(0, 3).toUpperCase()}${id}` }));
		} catch (error) {
			throw new BadRequestException('Error al procesar el archivo Excel: ' + error.message);
		}
	}

	async validateRelations(records: TransporterTravel[]) {
		// Validar zonas
		const zones = records.flatMap((item) => item.zone.toUpperCase());
		const _zones = await this.childrensRepository.find({ where: { name: In(zones) } });
		if (!_zones || _zones.length !== zones.length) {
			throw new BusinessException('Verifique las zonas ingresadas - ' + zones.join(', '));
		}

		// Validar productos
		const products = records.reduce((acc, item) => {
			acc = [...acc, ...item.details.map((r) => r.batteryType.toUpperCase())];
			return acc;
		}, []);
		const _products = await this.productRepository.find({ where: { name: In(products) } });
		if (!_products || _products.length !== products.length) {
			throw new BusinessException('Verifique los productos ingresados - ' + products.join(', '));
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

	convertDetail(details: any): any[] {
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

		if (!item.details || item.details.length === 0) {
			throw new BusinessException('Todos los registros deben tener al menos un detalle.');
		}

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

		await this.transporterTravelRepository.save(existingRecord);
	}
}
