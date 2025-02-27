import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateAuditRouteDto { }

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

export class ConciliateByTypesAuditRouteDto {
	@ApiProperty({ description: 'Rutas', isArray: true, type: [ConciliateByTypeAuditRouteDto] })
	@IsArray({ message: 'Debe de ser un array' })
	content: ConciliateByTypeAuditRouteDto[];
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
}
