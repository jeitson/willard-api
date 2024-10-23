import { ApiProperty, IntersectionType, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsInt, MaxLength, Matches, Min, Max, ValidateNested, maxLength } from "class-validator";
import { PagerDto } from "src/core/common/dto/pager.dto";

export class ShipmentDetailDto {
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
}

export class ShipmentPhotoDto {
	@ApiProperty({ description: 'URL de la foto' })
	@IsString({ message: 'Url debe ser una cadena de texto.' })
	@IsNotEmpty({ message: 'Url es obligatoria.' })
	@MaxLength(255, { message: 'Url no puede exceder 255 caracteres.' })
	url: string;
}

export class ShipmentERCDto {
	@ApiProperty({ description: 'Nombre' })
	@IsString({ message: 'Nombre debe ser una cadena de texto.' })
	@IsNotEmpty({ message: 'Nombre es obligatorio.' })
	@MaxLength(255, { message: 'Nombre no puede exceder 255 caracteres.' })
	name: string;
}

export class ShipmentDto {
	@ApiProperty({ description: 'ID de la transportadora' })
	@IsNotEmpty({ message: 'TransportadoraId es obligatorio.' })
	@IsInt({ message: 'TransportadoraId debe ser un número entero.' })
	transporterId: number;

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

	@ApiProperty({ description: 'Número de guía' })
	@IsNotEmpty({ message: 'NumeroGuia es obligatorio.' })
	@IsString({ message: 'NumeroGuia debe ser un texto.' })
	@MaxLength(10, { message: 'Debe de tener máximo 10 caracteres.' })
	// @Matches(/^[A-Z0-9]{10}$/, { message: 'NumeroGuia debe ser alfanumérico, de 10 dígitos y en mayúsculas.' })
	guideNumber: string;

	// Referencias opcionales - aplica si la sede de acopio es una agencia
	@ApiProperty({ description: 'Documento de referencia 1' })
	@IsOptional()
	@Matches(/^[A-Z0-9]{0,10}$/, { message: 'DocReferencia1 debe ser alfanumérico y tener hasta 10 caracteres.' })
	referenceDoc1?: string;

	@ApiProperty({ description: 'Documento de referencia 2' })
	@IsOptional()
	@Matches(/^[A-Z0-9]{0,10}$/, { message: 'DocReferencia2 debe ser alfanumérico y tener hasta 10 caracteres.' })
	referenceDoc2?: string;

	@ApiProperty({ description: 'Detalles del envío', isArray: true, type: ShipmentDetailDto })
	@IsOptional()
	details?: ShipmentDetailDto[];

	@ApiProperty({ description: 'Fotos del envío', isArray: true, type: ShipmentPhotoDto })
	@IsOptional()
	photos?: ShipmentPhotoDto[];

	@ApiProperty({ description: 'ERC', isArray: true, type: ShipmentERCDto })
	@IsOptional()
	erc?: ShipmentERCDto[];
}

export class ShipmentUpdateDto extends PartialType(ShipmentDto) { }

export class ShipmentQueryDto extends IntersectionType(
	PagerDto<ShipmentDto>,
	PartialType(ShipmentDto),
) { }
