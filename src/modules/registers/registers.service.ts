import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Register } from './entities/register.entity';
import { RegisterDto } from './dto/register.dto';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';

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
			throw new BusinessException('Error de validación', 400);
		}

		try {
			const item = this.mapExcelRowToRegisterDto(data);
			const travelRecord = this.registerRepository.create(item);
			return await this.registerRepository.save(travelRecord);
		} catch (error) {
			throw new BusinessException('Error al procesar el objeto JSON: ' + error.message);
		}
	}

	async createFromExcel(file: Express.Multer.File): Promise<Register[]> {
		try {
			const workbook = XLSX.read(file.buffer, { type: 'buffer' });
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];
			const jsonData = XLSX.utils.sheet_to_json(sheet);

			const records = [];
			for (const row of jsonData) {
				const record = this.mapExcelRowToRegisterDto(row);

				const errors = await validate(record);
				if (errors.length > 0) {
					throw new BusinessException('Error de validación en fila', 400);
				}

				records.push(this.registerRepository.create(record));
			}

			return await this.registerRepository.save(records);
		} catch (error) {
			throw new BusinessException('Error al procesar el archivo Excel: ' + error.message);
		}
	}

	private mapExcelRowToRegisterDto(row: any): any {
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
			supportUrls: row['urlSoportes'] ? row['urlSoportes'].split(',') : [],
			details: row['detalles'] ? row['detalles'].map((d: any) => ({
				batteryType: d.tipoBat,
				quantities: d.cantidades,
				travelRecord: 1,
			})) : []
		};
	}
}
