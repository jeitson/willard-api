import { ApiProperty, IntersectionType, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsInt, MaxLength, Matches, Min, Max, ValidateNested, maxLength, IsArray, ArrayNotEmpty } from "class-validator";
import { PagerDto } from "src/core/common/dto/pager.dto";
import { Product } from "src/modules/products/entities/product.entity";

export class ReceptionDetailDto {
	@ApiProperty({ description: 'ID del producto' })
	@IsNotEmpty({ message: 'ProductoId es obligatorio.' })
	@IsInt({ message: 'ProductoId debe ser un número entero.' })
	productId: number;

	@ApiProperty({ description: 'Cantidad de productos, máximo 10,000' })
	@IsNotEmpty({ message: 'Cantidad es obligatoria.' })
	@IsInt({ message: 'Cantidad debe ser un número entero.' })
	@Min(1, { message: 'La cantidad mínima es 1.' })
	@Max(10000, { message: 'La cantidad máxima es 10,000.' })
	quantity: number;

	product?: Product;
}

export class ReceptionPhotoDto {
	@ApiProperty({ description: 'URL de la foto' })
	@IsString({ message: 'Url debe ser una cadena de texto.' })
	@IsNotEmpty({ message: 'Url es obligatoria.' })
	@MaxLength(255, { message: 'Url no puede exceder 255 caracteres.' })
	url: string;
}

export class ReceptionRouteIdDto {
	@ApiProperty({ description: 'Número de ruta' })
	@IsNotEmpty({ message: 'Número de ruta es obligatorio.' })
	@IsString({ message: 'Número de ruta debe ser un texto.' })
	@MaxLength(10, { message: 'Debe de tener máximo 10 caracteres.' })
	// @Matches(/^[A-Z0-9]{10}$/, { message: 'Número de ruta debe ser alfanumérico, de 10 dígitos y en mayúsculas.' })
	routeId: string;
}

export class ReceptionDto extends ReceptionRouteIdDto {
	@ApiProperty({ description: 'ID de la transportadora' })
	@IsNotEmpty({ message: 'TransportadoraId es obligatorio.' })
	@IsInt({ message: 'TransportadoraId debe ser un número entero.' })
	transporterId: number;

	@ApiProperty({ description: 'ID de la sede de acopio' })
	@IsOptional()
	@IsInt({ message: 'SedeAcopioId debe ser un número entero.' })
	collectionSiteId: number;

	@ApiProperty({ description: 'Placa del vehículo' })
	@IsNotEmpty({ message: 'Placa es obligatorio.' })
	@IsString({ message: 'Placa debe ser un texto.' })
	@MaxLength(8, { message: 'Placa no puede tener más de 8 caracteres.' })
	licensePlate: string;

	@ApiProperty({ description: 'Nombre del conductor' })
	@IsNotEmpty({ message: 'Conductor es obligatorio.' })
	@IsString({ message: 'Conductor debe ser un texto.' })
	@MaxLength(50, { message: 'Conductor no puede tener más de 50 caracteres.' })
	driver: string;

	// Referencias opcionales - aplica si la sede de acopio es una agencia
	@ApiProperty({ description: 'Documento de referencia 1' })
	@IsOptional()
	@Matches(/^[A-Z0-9]{0,10}$/, { message: 'DocReferencia1 debe ser alfanumérico y tener hasta 10 caracteres.' })
	referenceDoc1?: string;

	@ApiProperty({ description: 'Documento de referencia 2' })
	@IsOptional()
	@Matches(/^[A-Z0-9]{0,10}$/, { message: 'DocReferencia2 debe ser alfanumérico y tener hasta 10 caracteres.' })
	referenceDoc2?: string;

	@ApiProperty({ description: 'Fotos de la recepción', isArray: true, type: ReceptionPhotoDto })
	@IsOptional()
	photos?: ReceptionPhotoDto[];

	@ApiProperty({ type: [ReceptionDetailDto], description: 'Detalles de la recepción' })
	@IsArray({ message: 'El campo "details" debe ser un arreglo de detalles' })
	@ArrayNotEmpty({ message: 'El arreglo de detalles no puede estar vacío' })
	@ValidateNested({ each: true, message: 'Cada detalle de la recepción debe ser válido' })
	@Type(() => ReceptionDetailDto)
	details?: ReceptionDetailDto[];
}

export class ReceptionUpdateDto extends PartialType(ReceptionDto) { }

export class ReceptionQueryDto extends IntersectionType(
	PagerDto<ReceptionDto>,
	PartialType(ReceptionDto),
) { }
