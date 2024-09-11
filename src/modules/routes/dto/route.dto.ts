import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsDateString, IsBoolean } from "class-validator";

export class CreateRouteDto {
	@ApiProperty({ description: 'Estado de la ruta' })
	@IsNotEmpty()
	routeStatusId: bigint;

	@ApiProperty({ description: 'Nombre' })
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({ description: 'Descripción', required: false })
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty({ description: 'Fecha de confirmación de recogida', required: false })
	@IsOptional()
	@IsDateString()
	confirmedPickUpDate?: string;

	@ApiProperty({ description: 'Fecha de apertura del viaje', required: false })
	@IsOptional()
	@IsDateString()
	tripStartDate?: string;

	@ApiProperty({ description: 'Hora de apertura del viaje', required: false })
	@IsOptional()
	@IsString()
	tripStartTime?: string;

	@ApiProperty({ description: 'Fecha de cierre del viaje', required: false })
	@IsOptional()
	@IsDateString()
	tripEndDate?: string;

	@ApiProperty({ description: 'Hora de cierre del viaje', required: false })
	@IsOptional()
	@IsString()
	tripEndTime?: string;

	@ApiProperty({ description: 'Placa' })
	@IsNotEmpty()
	@IsString()
	plate: string;

	@ApiProperty({ description: 'Tipo de camión' })
	@IsNotEmpty()
	truckTypeId: bigint;

	@ApiProperty({ description: 'Fecha de entrega en el sitio de acopio', required: false })
	@IsOptional()
	@IsDateString()
	deliveryDateToCollectionSite?: string;

	@ApiProperty({ description: 'ID del transportador' })
	@IsNotEmpty()
	transporterId: number;
}

export class UpdateRouteDto {
	@ApiProperty({ description: 'Nombre', required: false })
	@IsOptional()
	@IsString()
	name?: string;

	@ApiProperty({ description: 'Descripción', required: false })
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty({ description: 'Fecha de confirmación de recogida', required: false })
	@IsOptional()
	@IsDateString()
	confirmedPickUpDate?: string;

	@ApiProperty({ description: 'Fecha de apertura del viaje', required: false })
	@IsOptional()
	@IsDateString()
	tripStartDate?: string;

	@ApiProperty({ description: 'Hora de apertura del viaje', required: false })
	@IsOptional()
	@IsString()
	tripStartTime?: string;

	@ApiProperty({ description: 'Fecha de cierre del viaje', required: false })
	@IsOptional()
	@IsDateString()
	tripEndDate?: string;

	@ApiProperty({ description: 'Hora de cierre del viaje', required: false })
	@IsOptional()
	@IsString()
	tripEndTime?: string;

	@ApiProperty({ description: 'Placa', required: false })
	@IsOptional()
	@IsString()
	plate?: string;

	@ApiProperty({ description: 'Tipo de camión', required: false })
	@IsOptional()
	truckTypeId?: bigint;

	@ApiProperty({ description: 'Fecha de entrega en el sitio de acopio', required: false })
	@IsOptional()
	@IsDateString()
	deliveryDateToCollectionSite?: string;
}
