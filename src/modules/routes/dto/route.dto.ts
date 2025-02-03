import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsDateString, IsBoolean, ValidateNested, MaxLength } from "class-validator";
import { DriverDto } from "src/modules/drivers/dto/driver.dto";

export class CreateRouteDto {
	@ApiProperty({ description: 'Estado de la ruta' })
	@IsNotEmpty()
	routeStatusId: number;

	@ApiProperty({ description: 'Nombre' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	name: string = '';

	@ApiProperty({ description: 'Descripción', required: false })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	description?: string = '';

	@ApiProperty({ description: 'Fecha de confirmación de recogida', required: true })
	@IsOptional()
	@IsDateString()
	confirmedPickUpDate: string;

	@ApiProperty({ description: 'Fecha de apertura del viaje', required: true })
	@IsOptional()
	@IsDateString()
	tripStartDate: string;

	@ApiProperty({ description: 'Hora de apertura del viaje', required: true })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	tripStartTime: string;

	@ApiProperty({ description: 'Fecha de cierre del viaje', required: true })
	@IsOptional()
	@IsDateString()
	tripEndDate: string;

	@ApiProperty({ description: 'Hora de cierre del viaje', required: true })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	tripEndTime: string;

	@ApiProperty({ description: 'Placa' })
	@IsNotEmpty()
	@IsString({ message: 'Debe de ser un texto' })
	plate: string;

	@ApiProperty({ description: 'Tipo de camión' })
	@IsNotEmpty()
	truckTypeId: number;

	@ApiProperty({ description: 'Fecha de entrega en el sitio de acopio', required: true })
	@IsOptional()
	@IsDateString()
	deliveryDateToCollectionSite: string;

	@ApiProperty({ description: 'Datos del transportador', type: DriverDto })
	@ValidateNested()
	@Type(() => DriverDto)
	transporter: DriverDto;

	@ApiProperty({ description: 'Número de guía' })
	@IsNotEmpty({ message: 'NumeroGuia es obligatorio.' })
	@IsString({ message: 'NumeroGuia debe ser un texto.' })
	@MaxLength(10, { message: 'Debe de tener máximo 10 caracteres.' })
	guideNumber: string;
}

export class UpdateRouteDto {
	@ApiProperty({ description: 'Nombre', required: false })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	name?: string;

	@ApiProperty({ description: 'Descripción', required: false })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
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
	@IsString({ message: 'Debe de ser un texto' })
	tripStartTime?: string;

	@ApiProperty({ description: 'Fecha de cierre del viaje', required: false })
	@IsOptional()
	@IsDateString()
	tripEndDate?: string;

	@ApiProperty({ description: 'Hora de cierre del viaje', required: false })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	tripEndTime?: string;

	@ApiProperty({ description: 'Placa', required: false })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	plate?: string;

	@ApiProperty({ description: 'Tipo de camión', required: false })
	@IsOptional()
	truckTypeId?: number;

	@ApiProperty({ description: 'Fecha de entrega en el sitio de acopio', required: false })
	@IsOptional()
	@IsDateString()
	deliveryDateToCollectionSite?: string;

	@ApiProperty({ description: 'Número de guía' })
	@IsOptional()
	@IsString({ message: 'NumeroGuia debe ser un texto.' })
	@MaxLength(10, { message: 'Debe de tener máximo 10 caracteres.' })
	guideNumber?: string;
}
