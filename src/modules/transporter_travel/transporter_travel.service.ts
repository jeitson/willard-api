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

	async createFromJson(data: TransporterTravelDto): Promise<TransporterTravel[]> {
		const travelRecordDto = plainToClass(TransporterTravelDto, data);

		const errors = await validate(travelRecordDto);

		if (errors.length > 0) {
			const errorMessages = errors.map(error => {
				const constraints = error.constraints
					? Object.values(error.constraints)
					: [];
				return {
					property: error.property,
					errors: constraints,
				};
			});

			throw new UnprocessableEntityException({
				message: 'Validation failed',
				errors: errorMessages,
			});
		}

		try {
			const item = this.mapRowToTransporterTravelDto(data);
			item.details = this.convertDetail(data.detalles);
			console.log(item);

			await this.validateRelations([item]);

			const travelRecord = this.transporterTravelRepository.create(item);
			return await this.transporterTravelRepository.save(travelRecord);
		} catch (error) {
			console.log(error);
			throw new BusinessException('Error al procesar el objeto JSON: ' + error.message);
		}
	}

	async createFromExcel(file: any): Promise<TransporterTravel[]> {
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

				const errors = await validate(record);
				if (errors.length > 0) {
					const errorMessages = errors.map(error => ({
						property: error.property,
						errors: Object.values(error.constraints || {}),
					}));

					validationErrors.push({
						row: index + 1,
						errors: errorMessages,
					});
				} else {
					records.push(this.transporterTravelRepository.create(record));
				}
			}

			if (validationErrors.length > 0) {
				throw new UnprocessableEntityException({
					message: 'Error de validación en una o más filas',
					errors: validationErrors,
				});
			}

			await this.validateRelations(records);

			return await this.transporterTravelRepository.save(records);

		} catch (error) {
			throw new BadRequestException('Error al procesar el archivo Excel: ' + error.message);
		}
	}

	async validate(item: any): Promise<any[]> {
		const errors = await validate(item);

		if (errors.length > 0) {
			return errors.map(error => {
				const constraints = error.constraints
					? Object.values(error.constraints)
					: [];
				return {
					property: error.property,
					errors: constraints,
				};
			});
		}

		return [];
	}

	async validateRelations(records: TransporterTravel[]) {
		// Zonas
		const zones = records.flatMap(item => item.zone.toUpperCase());

		const _zones = await this.childrensRepository.find({ where: { name: In(zones) } });

		if (!_zones) {
			throw new BusinessException('No existen las zonas ingresadas');
		}

		if (_zones.length !== zones.length) {
			throw new BusinessException('Verifique las zonas ingresadas - ' + zones.join(', '));
		}

		// Productos
		const products = records.reduce((acc, item) => {
			acc = [...acc, ...item.details.map((r: { batteryType: string; }) => r.batteryType.toUpperCase())]
			return acc;
		}, []);

		const _products = await this.productRepository.find({ where: { name: In(products) } });

		if (!_products) {
			throw new BusinessException('No existen los productos ingresados');
		}

		if (_products.length !== products.length) {
			throw new BusinessException('Verifique los productos ingresados - ' + products.join(', '));
		}
	}

	private mapRowToTransporterTravelDto(row: any): any {
		return {
			routeId: row['idRuta'],
			guideId: row['idGuia'],
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
			details: []
		};
	}

	convertDetail(details: any): any[] {
		return details.map((d: any) => ({
			batteryType: d.tipoBat.toUpperCase(),
			quantity: d.cantidad,
		})) || [];
	}
}
