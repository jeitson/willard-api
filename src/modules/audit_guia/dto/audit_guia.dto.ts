import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, IsOptional, IsBoolean, IsDateString, IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { PagerDto } from 'src/core/common/dto/pager.dto';

export class AuditGuiaDetailCreateDto {
	@ApiProperty({ description: 'ID de producto' })
	@IsInt({ message: 'El ID del producto debe ser un número entero' })
	productId: number;

	@ApiProperty({ description: 'Es Recuperadora' })
	@IsOptional()
	@IsBoolean({ message: 'El campo "Es Recuperadora" debe ser un valor booleano' })
	isRecuperator?: boolean;

	@ApiProperty({ description: 'Cantidad' })
	@IsInt({ message: 'La cantidad debe ser un número entero' })
	quantity: number;

	@ApiProperty({ description: 'Cantidad Corregida' })
	@IsInt({ message: 'La cantidad corregida debe ser un número entero' })
	quantityCollection: number;
}

export class AuditGuiaCreateDto {
	@ApiProperty({ description: 'Número de guía' })
	@IsString({ message: 'El número de guía debe ser una cadena de caracteres' })
	guideNumber: string;

	@ApiProperty({ description: 'Fecha de la auditoría' })
	@IsDateString({}, { message: 'La fecha debe ser una cadena de fecha válida en formato ISO' })
	date: string;

	@ApiProperty({ description: 'Zona ID' })
	@IsInt({ message: 'El ID de la zona debe ser un número entero' })
	zoneId: number;

	@ApiProperty({ description: 'Recuperadora ID' })
	@IsInt({ message: 'El ID de la recuperadora debe ser un número entero' })
	recuperatorId: number;

	@ApiProperty({ description: 'Transportadora ID' })
	@IsInt({ message: 'El ID de la transportadora debe ser un número entero' })
	transporterId: number;

	@ApiProperty({ description: 'Total Recuperadora' })
	@IsInt({ message: 'El total de la recuperadora debe ser un número entero' })
	recuperatorTotal: number;

	@ApiProperty({ description: 'Total Transportadora' })
	@IsInt({ message: 'El total de la transportadora debe ser un número entero' })
	transporterTotal: number;

	@ApiProperty({ description: 'Estado de la auditoría' })
	@IsInt({ message: 'El ID del estado de la auditoría debe ser un número entero' })
	requestStatusId: number;

	@ApiProperty({ description: 'A Favor Recuperadora', required: false })
	@IsOptional()
	@IsBoolean({ message: 'El campo "A Favor Recuperadora" debe ser un valor booleano' })
	inFavorRecuperator?: boolean;

	@ApiProperty({ description: 'Comentario de la auditoría', required: false })
	@IsOptional()
	@IsString({ message: 'El comentario debe ser una cadena de caracteres' })
	comment?: string;

	@ApiProperty({ type: [AuditGuiaDetailCreateDto], description: 'Detalles de la auditoría' })
	@IsArray({ message: 'El campo "auditGuiaDetails" debe ser un arreglo de detalles' })
	@ArrayNotEmpty({ message: 'El arreglo de detalles no puede estar vacío' })
	@ValidateNested({ each: true, message: 'Cada detalle de la auditoría debe ser válido' })
	@Type(() => AuditGuiaDetailCreateDto)
	auditGuiaDetails: AuditGuiaDetailCreateDto[];
}

export class AuditGuiaQueryDto extends IntersectionType(
	PagerDto<AuditGuiaCreateDto>,
	PartialType(AuditGuiaCreateDto),
) { }
