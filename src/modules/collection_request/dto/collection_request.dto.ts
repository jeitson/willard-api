import { ApiProperty, IntersectionType, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, IsNumber, MaxLength, ValidateIf, Min, IsNotEmpty } from "class-validator";
import { PagerDto } from "src/core/common/dto/pager.dto";

export class CollectionRequestCreateDto {
	@ApiProperty({ description: 'Cliente asociado' })
	@IsInt({ message: 'Debe de ser un número' })
	@Min(1, { message: 'El ID del cliente no puede ser 0' })
	clientId: number;

	@ApiProperty({ description: 'Lugar de recogida asociado' })
	@IsInt({ message: 'Debe de ser un número' })
	@Min(1, { message: 'El ID del lugar de recogida no puede ser 0' })
	pickUpLocationId: number;

	@ApiProperty({ description: 'ID del tipo de producto, debe ser un número.' })
	@IsNotEmpty({ message: 'TipoProductoId es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'TipoProductoId debe ser un número.' })
	productTypeId: number;

	@ApiProperty({ description: 'Descripción' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255)
	description?: string;

	@ApiProperty({ description: 'ID del motivo especial, debe ser un número.' })
	@IsNotEmpty({ message: 'MotivoEspecial es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'MotivoEspecial debe ser un número.' })
	motiveSpecialId: number = null;

	@ApiProperty({ description: 'Cantidad estimada' })
	@IsNumber()
	estimatedQuantity: number;

	@ApiProperty({ description: 'KG estimados' })
	@IsNumber()
	estimatedKG: number;

	@ApiProperty({ description: 'Es especial' })
	@IsBoolean()
	isSpecial: boolean;

	@ApiProperty({ description: 'Fecha estimada de recogida' })
	@IsOptional()
	@IsDateString()
	estimatedPickUpDate?: string;

	@ApiProperty({ description: 'Hora estimada de recogida' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	estimatedPickUpTime?: string;

	@ApiProperty({ description: 'Observaciones' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255)
	observations?: string;

	@ApiProperty({ description: 'Recomendaciones' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255)
	recommendations?: string;

	@ApiProperty({ description: 'Transportadora asociada' })
	@IsOptional()
	transporterId: number = null;
}

export class CollectionRequestCompleteDto {
	@ApiProperty({ description: 'Sede de acopio' })
	@IsInt({ message: 'Debe de ser un número' })
	@Min(1, { message: 'El ID de la sede de acopio no puede ser 0' })
	collectionSiteId: number;

	@ApiProperty({ description: 'Asesor' })
	@IsInt({ message: 'Debe de ser un número' })
	@Min(1, { message: 'El ID del asesor no puede ser 0' })
	consultantId: number;

	@ApiProperty({ description: 'Transportadora asociada' })
	@IsOptional()
	@IsInt({ message: 'Debe de ser un número' })
	transporterId: number = null;

	@ApiProperty({ description: 'Id de Ruta' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	routeId: string = null;
}

export class CollectionRequestUpdateDto {
	@ApiProperty({ description: 'Cliente asociado' })
	@IsInt({ message: 'Debe de ser un número' })
	@Min(1, { message: 'El ID del cliente no puede ser 0' })
	clientId: number;

	@ApiProperty({ description: 'Lugar de recogida asociado' })
	@IsInt({ message: 'Debe de ser un número' })
	@Min(1, { message: 'El ID del lugar de recogida no puede ser 0' })
	pickUpLocationId: number;

	@ApiProperty({ description: 'ID del tipo de producto, debe ser un número.' })
	@IsNotEmpty({ message: 'TipoProductoId es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'TipoProductoId debe ser un número.' })
	productTypeId: number;

	@ApiProperty({ description: 'Nombre' })
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(50)
	name: string;

	@ApiProperty({ description: 'Descripción' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255)
	description?: string;

	@ApiProperty({ description: 'ID del motivo especial, debe ser un número.' })
	@IsNotEmpty({ message: 'MotivoEspecial es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'MotivoEspecial debe ser un número.' })
	motiveSpecialId: number = null;

	@ApiProperty({ description: 'Fecha de solicitud' })
	@IsDateString()
	requestDate: string;

	@ApiProperty({ description: 'Hora de solicitud' })
	@IsString({ message: 'Debe de ser un texto' })
	requestTime: string;

	@ApiProperty({ description: 'Cantidad estimada' })
	@IsNumber()
	estimatedQuantity: number;

	@ApiProperty({ description: 'KG estimados' })
	@IsNumber()
	estimatedKG: number;

	@ApiProperty({ description: 'Fecha estimada de recogida' })
	@IsOptional()
	@IsDateString()
	estimatedPickUpDate?: string;

	@ApiProperty({ description: 'Hora estimada de recogida' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	estimatedPickUpTime?: string;

	@ApiProperty({ description: 'Observaciones' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255)
	observations?: string;

	@ApiProperty({ description: 'Recomendaciones' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255)
	recommendations?: string;

	@ApiProperty({ description: 'Transportadora asociada' })
	@IsOptional()
	@IsInt({ message: 'Debe de ser un número' })
	transporterId: number = null;
}

export class CollectionRequestQueryDto extends IntersectionType(
	PagerDto<CollectionRequestCreateDto>,
	PartialType(CollectionRequestCreateDto),
) { }
