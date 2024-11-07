import { Injectable, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Register } from './entities/register.entity';
import { RegisterDto } from './dto/register.dto';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { excelDateToJSDate, excelTimeToJSDate } from 'src/core/utils';

@Injectable()
export class RegistersService {
	constructor(
		@InjectRepository(Register)
		private readonly registerRepository: Repository<Register>,
	) { }

	async createFromJson(data: RegisterDto): Promise<Register[]> {
		const travelRecordDto = plainToClass(RegisterDto, data);

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
			const item = this.mapRowToRegisterDto(data);
			const travelRecord = this.registerRepository.create(item);
			return await this.registerRepository.save(travelRecord);
		} catch (error) {
			throw new BusinessException('Error al procesar el objeto JSON: ' + error.message);
		}
	}

	async createFromExcel(file: any): Promise<Register[]> {
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
					cantidades: detail['cantidades'],
				});
				return acc;
			}, {});

			for (const [index, row] of mainData.entries()) {
				row['fechaMov'] = excelDateToJSDate(row['fechaMov']);
				row['horaMov'] = excelTimeToJSDate(row['horaMov']);

				const record = this.mapRowToRegisterDto(row);

				const details = detailsByGuide[record.idGuia] || [];
				record.detalles = details.map(detail => this.mapRowToRegisterDto(detail));

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
					records.push(this.registerRepository.create(record));
				}
			}

			if (validationErrors.length > 0) {
				throw new UnprocessableEntityException({
					message: 'Error de validación en una o más filas',
					errors: validationErrors,
				});
			}

			return await this.registerRepository.save(records);

		} catch (error) {
			console.log(error);
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

	private mapRowToRegisterDto(row: any): any {
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
			details: Array.isArray(row['detalles']) ? this.convertDetail(row['detalles']) : this.convertDetail(JSON.parse(row['detalles']))
		};
	}

	convertDetail(details: any): any[] {
		return details.map((d: any) => ({
			batteryType: d.tipoBat,
			quantities: d.cantidades,
		})) || [];
	}
}
