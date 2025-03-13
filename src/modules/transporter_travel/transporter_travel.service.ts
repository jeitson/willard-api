import { Injectable, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { excelDateToJSDate, excelTimeToJSDate } from 'src/core/utils';
import { TransporterTravel } from './entities/transporter_travel.entity';
import { TransporterTravelDto, TransporterTravelRouteIdDto } from './dto/transporter_travel.dto';
import { Product } from '../products/entities/product.entity';
import { Child } from '../catalogs/entities/child.entity';
import { ResponseCodeTransporterTravel } from './entities/response';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { paginate } from 'src/core/helper/paginate';
import { AuditRouteService } from '../audit_route/audit_route.service';
import { UserContextService } from '../users/user-context.service';

@Injectable()
export class TransporterTravelService {
	constructor(
		@InjectRepository(TransporterTravel)
		private readonly transporterTravelRepository: Repository<TransporterTravel>,
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,
		@InjectRepository(Child)
		private readonly childrensRepository: Repository<Child>,
		private readonly auditRouteService: AuditRouteService,
		private userContextService: UserContextService,
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

		let { id: user_id, transporter, zones } = this.userContextService.getUserDetails();

		if (!transporter) {
			throw new BusinessException('El usuario no tiene configurado una transportadora');
		}

		if (zones.length === 0) {
			throw new BusinessException('El usuario no tiene configurado zonas');
		}

		if(!zones.map(({ zone }) => zone.name).includes(travelRecordDto.zona)) {
			throw new BusinessException('Está intentando ingresar una zona que no tiene asignada');
		}

		try {
			const item = this.mapRowToTransporterTravelDto(data);
			item.details = this.convertDetail(data.detalles);

			await this.validateAllRecords([item]);

			if (item.guidePreviousId) {
				await this.updateTransporterTravel(item);
			} else {
				const travelRecord = this.transporterTravelRepository.create(item);
				const savedRecord = await this.transporterTravelRepository.save({ ...travelRecord, createdBy: user_id, modifiedBy: user_id, transporter });

				return savedRecord.map(({ type, id }) => ({ codigoSolicitud: `${type.slice(0, 3).toUpperCase()}${id}` }));
			}
		} catch (error) {
			throw new BusinessException('Error al procesar el objeto JSON: ' + error.message);
		}
	}

	async createFromExcel(file: any): Promise<ResponseCodeTransporterTravel[]> {
		try {
			let { id: user_id, transporter, zones } = this.userContextService.getUserDetails();
			const createdBy = user_id, modifiedBy = user_id;

			if (!transporter) {
				throw new BusinessException('El usuario no tiene configurado una transportadora');
			}

			if (zones.length === 0) {
				throw new BusinessException('El usuario no tiene configurado zonas');
			}

			if (!transporter) {
				throw new BusinessException('El usuario no tiene configurado una transportadora');
			}

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

				if (record.guidePreviousId) {
					recordsToUpdate.push({ ...record, modifiedBy });
				} else {
					recordsToCreate.push({ ...record, createdBy, modifiedBy });
				}
			}

			const _zones = zones.map(({ zone }) => zone.name);

			if(!recordsToCreate.map((element) => element.zona).every((element) => _zones.includes(element))) {
				throw new BusinessException('Está intentando ingresar una zona que no tiene asignada');
			}

			await this.validateAllRecords([...recordsToCreate, ...recordsToUpdate]);

			for (const record of recordsToUpdate) {
				await this.updateTransporterTravel(record);
			}

			const savedRecords = await this.transporterTravelRepository.save(recordsToCreate.map((element) => ({ ...element, transporter })));

			const allSavedRecords = [
				...savedRecords,
				...recordsToUpdate.map((record) => ({ type: record.type, id: record.guidePreviousId })),
			];

			return allSavedRecords.map(({ type, id }) => ({ codigoSolicitud: `${type.slice(0, 3).toUpperCase()}${id}` }));
		} catch (error) {
			throw new BadRequestException('Error al procesar el archivo Excel: ' + error.message);
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
			throw new BusinessException(`No se encontró ningún registro con idRutaAntes: ${item.guidePreviousId}`);
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
		await this.transporterTravelRepository.save({ ...existingRecord, modifiedBy: item.modifiedBy });
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

	async findAll(query: any): Promise<Pagination<TransporterTravel>> {
		let { id: user_id, transporter: transporter, zones } = this.userContextService.getUserDetails();

		if (!transporter) {
			throw new BusinessException('El usuario no tiene configurado una transportadora');
		}

		const transporterId = transporter.id;

		if (zones.length === 0) {
			throw new BusinessException('El usuario no tiene configurado zonas');
		}

		zones.map(({ zone }) => zone.name)

		const queryBuilder = this.transporterTravelRepository
			.createQueryBuilder('transporter_travel')
			.leftJoinAndSelect('transporter_travel.details', 'details')
			.leftJoinAndSelect('transporter_travel.transporter', 'transporter')
			.where('transporter_travel.zone IN (:...zones) AND createdBy =: user_id AND transporter.id =: transporterId', { zones, user_id, transporterId });

		return await paginate<TransporterTravel>(queryBuilder, {
			page: query.page,
			pageSize: query.pageSize,
		});
	}

	async updateRouteId(id: number, { idRuta: routeId }: TransporterTravelRouteIdDto): Promise<void> {
		const existingRecord = await this.transporterTravelRepository.findOne({
			where: { id },
			relations: ['transportersTravels', 'details'],
		});

		if (!existingRecord) {
			throw new BusinessException(`No se encontró ningún registro con ID: ${id}`);
		}

		await this.transporterTravelRepository.update(existingRecord.id, { routeId });
	}
}
