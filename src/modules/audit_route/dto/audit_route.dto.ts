import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, ValidateNested } from "class-validator";
import { Child } from "src/modules/catalogs/entities/child.entity";
import { Product } from "src/modules/products/entities/product.entity";
import { Reception } from "src/modules/receptions/entities/reception.entity";
import { TransporterTravel } from "src/modules/transporter_travel/entities/transporter_travel.entity";
import { Transporter } from "src/modules/transporters/entities/transporter.entity";

export class CreateAuditRouteDetailDto {
	@ApiProperty({ description: 'Guia ID', required: true })
	@IsString()
	@IsNotEmpty()
	guideId: string;

	@ApiProperty({ description: 'ID del producto', required: true })
	@IsNumber()
	@IsNotEmpty()
	productId: number;

	@ApiProperty({ description: 'Cantidad', required: true })
	@IsInt()
	@Min(1)
	quantity: number;

	@ApiProperty({ description: 'Cantidad Conciliada', required: true })
	@IsInt()
	@Min(0)
	quantityConciliated: number;
}

export class CreateAuditRouteDto {
	@ApiProperty({ description: 'RutaId', required: false })
	@IsString()
	@IsOptional()
	routeId?: string;

	@ApiProperty({ description: 'ID de recepción (FK)', required: true })
	@IsNotEmpty()
	receptionId: number;

	@ApiProperty({ description: 'ID de la transportadora viaje (FK)', required: true })
	@IsNotEmpty()
	transporterTravelId: number;

	@ApiProperty({ description: 'Fecha', required: true })
	@IsString()
	@IsNotEmpty()
	date: string;

	@ApiProperty({ description: 'Zona ID', required: false })
	@IsNumber()
	@IsOptional()
	zoneId?: number;

	@ApiProperty({ description: 'Recuperadora ID', required: false })
	@IsNumber()
	@IsOptional()
	recuperatorId?: number;

	@ApiProperty({ description: 'Transportadora ID', required: false })
	@IsNumber()
	@IsOptional()
	transporterId?: number;

	@ApiProperty({ description: 'Recuperadora Total', required: false })
	@IsInt()
	@Min(0)
	@IsOptional()
	recuperatorTotal?: number;

	@ApiProperty({ description: 'Transportadora Total', required: false })
	@IsInt()
	@Min(0)
	@IsOptional()
	transporterTotal?: number;

	@ApiProperty({ description: 'Conciliación Total', required: false })
	@IsInt()
	@Min(0)
	@IsOptional()
	conciliationTotal?: number;

	@ApiProperty({ description: 'Estado de la auditoría', required: true })
	@IsNumber()
	@IsNotEmpty()
	requestStatusId: number;

	@ApiProperty({ description: 'Comentario', required: false })
	@IsString()
	@MaxLength(1000)
	@IsOptional()
	comment?: string;

	@ApiProperty({ description: 'Detalles de la auditoría', required: true, type: [CreateAuditRouteDetailDto] })
    details: CreateAuditRouteDetailDto[];
}

export class GetInfoByRouteId {
	@ApiProperty({ description: 'RutaId', required: true })
	@IsString({ message: 'El número de ruta es requerido' })
	routeId: string;

	@ApiProperty({ description: 'Transportadora ID', required: true })
	@IsString({ message: 'La transportadora es requerida' })
	transporterId: number;
}

export class ListAuditRouteDto {
	origin: string;
	transporter: string | null;
	routeId: string;
	zone: string;
	date: string;
	recuperator: string | null;
	quantityTotal: number;
	gap: string | null;
	status: string;
	createdAt: Date;
}


export class AuditRouteDto {
	transporter: Transporter;
	routeId: string;
	zone: string;
	date: string;
	reception: Reception;
	transporterTravel: TransporterTravel;
	recuperatorTotal: number;
	transporterTotal: number;
	conciliationTotal: number;
	requestStatus: Child;
	products: {
		id: number;
		productId: number;
		name: string;
		quantity: number;
	}[];
}

export class ConciliateTotalsAuditRouteDto {
	@ApiProperty({ description: 'Cantidad total del recuperador, debe ser un número.' })
	@IsNotEmpty({ message: 'Cantidad total del recuperador es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'Cantidad total del recuperador debe ser un número.' })
	recuperatorTotal: number;

	@ApiProperty({ description: 'Cantidad total de la transportadora, debe ser un número.' })
	@IsNotEmpty({ message: 'Cantidad total de la transportadora es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'Cantidad total de la transportadora debe ser un número.' })
	transporterTotal: number;

	@ApiProperty({ description: 'Cantidad total de la conciliación, debe ser un número.' })
	@IsNotEmpty({ message: 'Cantidad total de la conciliación es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'Cantidad total de la conciliación debe ser un número.' })
	conciliationTotal: number;
}

export class ConciliateByTypeAuditRouteDto {
	@ApiProperty({ description: 'El id debe ser un número.' })
	@IsOptional()
	@IsNumber({}, { message: 'Id debe ser un número.' })
	id?: number;

	@ApiProperty({ description: 'Cantidad, debe ser un número.' })
	@IsNotEmpty({ message: 'Cantidad es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'Cantidad debe ser un número.' })
	quantity: number;

	@ApiProperty({ description: 'Producto' })
	@IsOptional()
	@IsNumber({}, { message: 'Producto debe ser un número.' })
	productId?: number;
}

export class ConciliateTransporterAuditRouteDto {
	@ApiProperty({ description: 'El id debe ser un número.' })
	@IsOptional()
	@IsNumber({}, { message: 'Id debe ser un número.' })
	id?: number;

	@ApiProperty({ description: 'Cantidad, debe ser un número.' })
	@IsNotEmpty({ message: 'Cantidad es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'Cantidad debe ser un número.' })
	quantity: number;

	@ApiProperty({ description: 'Producto' })
	@IsOptional()
	@IsString({ message: 'Producto debe ser un texto.' })
	productName?: string;

	@ApiProperty({ description: 'Número de Guía, debe ser un texto.' })
	@IsNotEmpty({ message: 'Número de Guía es obligatorio y debe ser un texto.' })
	@IsString({ message: 'Número de Guía debe ser un texto.' })
	guideNumber: string;

	@ApiProperty({ description: 'isNew, debe ser un booleano.' })
	@IsNotEmpty({ message: 'isNew es obligatorio y debe ser un booleano.' })
	@IsBoolean({ message: 'isNew debe ser un booleano.' })
	isNew: boolean;
}

export class ConfirmAuditRouteDto extends ConciliateTotalsAuditRouteDto {
	@ApiProperty({ description: 'RutaId', required: true })
	@IsString()
	routeId: string;

	@ApiProperty({ description: 'Transportadora ID', required: true })
	@IsNumber()
	transporterId: number;

	@ApiProperty({ description: 'Rutas', isArray: true, type: [ConciliateByTypeAuditRouteDto] })
	@IsArray({ message: 'Debe de ser un array' })
	@ArrayNotEmpty({ message: 'El arreglo puede estar vacío' })
	@ValidateNested({ each: true, message: 'Cada registro debe ser válido' })
	@Type(() => ConciliateByTypeAuditRouteDto)
	products: ConciliateByTypeAuditRouteDto[];

	@ApiProperty({ description: 'Rutas', isArray: true, type: [ConciliateTransporterAuditRouteDto] })
	@IsArray({ message: 'Debe de ser un array' })
	@ArrayNotEmpty({ message: 'El arreglo puede estar vacío' })
	@ValidateNested({ each: true, message: 'Cada registro debe ser válido' })
	@Type(() => ConciliateTransporterAuditRouteDto)
	transporter: ConciliateTransporterAuditRouteDto[];

	@ApiProperty({ description: 'IsSave es un valor booleano.' })
	@IsNotEmpty({ message: 'IsSave es obligatorio y debe ser un booleano.' })
	@IsBoolean({ message: 'IsSave debe ser un booleano.' })
	isSave: boolean;
}
