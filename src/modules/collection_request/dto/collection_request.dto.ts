import { ApiProperty, IntersectionType, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, IsNumber, MaxLength, ValidateIf, Min, IsNotEmpty } from "class-validator";
import { PagerDto } from "src/core/common/dto/pager.dto";

export class CollectionRequestCreateDto {
	@ApiProperty({ description: 'Cliente asociado' })
	@IsInt()
	@Min(1, { message: 'El ID del cliente no puede ser 0' })
	clientId: number;

	@ApiProperty({ description: 'Lugar de recogida asociado' })
	@IsInt()
	@Min(1, { message: 'El ID del lugar de recogida no puede ser 0' })
	pickUpLocationId: number;

	@ApiProperty({ description: 'ID del tipo de producto, debe ser un número.' })
	@IsNotEmpty({ message: 'TipoProductoId es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'TipoProductoId debe ser un número.' })
	productTypeId: number;

	@ApiProperty({ description: 'Descripción' })
	@IsOptional()
	@IsString()
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
	@IsString()
	estimatedPickUpTime?: string;

	@ApiProperty({ description: 'Observaciones' })
	@IsOptional()
	@IsString()
	@MaxLength(255)
	observations?: string;

	@ApiProperty({ description: 'Recomendaciones' })
	@IsOptional()
	@IsString()
	@MaxLength(255)
	recommendations?: string;

	@ApiProperty({ description: 'Transportadora asociada' })
	@IsInt()
	@Min(1, { message: 'El ID de la transportadora no puede ser 0' })
	transporterId: number;
}

export class CollectionRequestCompleteDto {
	@ApiProperty({ description: 'Sede de acopio' })
	@IsInt()
	@Min(1, { message: 'El ID de la sede de acopio no puede ser 0' })
	collectionSiteId: number;

	@ApiProperty({ description: 'Asesor' })
	@IsInt()
	@Min(1, { message: 'El ID del asesor no puede ser 0' })
	consultantId: number;

	@ApiProperty({ description: 'Transportadora asociada' })
	@IsInt()
	@Min(1, { message: 'El ID de la transportadora no puede ser 0' })
	transporterId: number;
}

export class CollectionRequestUpdateDto {
	@ApiProperty({ description: 'Cliente asociado' })
	@IsInt()
	@Min(1, { message: 'El ID del cliente no puede ser 0' })
	clientId: number;

	@ApiProperty({ description: 'Lugar de recogida asociado' })
	@IsInt()
	@Min(1, { message: 'El ID del lugar de recogida no puede ser 0' })
	pickUpLocationId: number;

	@ApiProperty({ description: 'ID del tipo de producto, debe ser un número.' })
	@IsNotEmpty({ message: 'TipoProductoId es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'TipoProductoId debe ser un número.' })
	productTypeId: number;

	@ApiProperty({ description: 'Nombre' })
	@IsString()
	@MaxLength(50)
	name: string;

	@ApiProperty({ description: 'Descripción' })
	@IsOptional()
	@IsString()
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
	@IsString()
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
	@IsString()
	estimatedPickUpTime?: string;

	@ApiProperty({ description: 'Observaciones' })
	@IsOptional()
	@IsString()
	@MaxLength(255)
	observations?: string;

	@ApiProperty({ description: 'Recomendaciones' })
	@IsOptional()
	@IsString()
	@MaxLength(255)
	recommendations?: string;
}

export class CollectionRequestQueryDto extends IntersectionType(
	PagerDto<CollectionRequestCreateDto>,
	PartialType(CollectionRequestCreateDto),
) { }
