import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class CreateAuditRouteDto { }

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

	@ApiProperty({ description: 'Cantidad, debe ser un texto.' })
	@IsNotEmpty({ message: 'Cantidad es obligatorio y debe ser un texto.' })
	@IsString({ message: 'Cantidad debe ser un texto.' })
	guideNumber: string;

	@ApiProperty({ description: 'Cantidad, debe ser un booleano.' })
	@IsNotEmpty({ message: 'Cantidad es obligatorio y debe ser un booleano.' })
	@IsBoolean({ message: 'Cantidad debe ser un booleano.' })
	isNew: string;
}

export class ConfirmAuditRouteDto extends ConciliateTotalsAuditRouteDto {
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
}
