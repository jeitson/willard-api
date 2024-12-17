import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, IsOptional, IsBoolean, IsDateString, IsArray, ArrayNotEmpty, ValidateNested, IsIn } from 'class-validator';
import { PagerDto } from 'src/core/common/dto/pager.dto';
import { Reception } from 'src/modules/receptions/entities/reception.entity';
import { Transporter } from 'src/modules/transporters/entities/transporter.entity';
import { JoinColumn, OneToOne } from 'typeorm';

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

	@ApiProperty({ type: Reception, description: 'Recepción' })
	@ValidateNested({ each: true })
	@Type(() => Reception)
	reception: Reception;

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

	@ApiProperty({ type: [AuditGuiaDetailCreateDto], description: 'Detalles de la auditoría' })
	@IsArray({ message: 'El campo "auditGuiaDetails" debe ser un arreglo de detalles' })
	@ArrayNotEmpty({ message: 'El arreglo de detalles no puede estar vacío' })
	@ValidateNested({ each: true, message: 'Cada detalle de la auditoría debe ser válido' })
	@Type(() => AuditGuiaDetailCreateDto)
	auditGuiaDetails: AuditGuiaDetailCreateDto[];
}

export class AuditGuiaDetailContentUpdateDto {
	@ApiProperty({ description: 'ID del detalle de la auditoría', required: true })
	@IsInt({ message: 'El ID del detalle debe ser un número entero' })
	id: number;

	@ApiProperty({ description: 'Cantidad Corregida', required: true })
	@IsInt({ message: 'La cantidad corregida debe ser un número entero' })
	quantityCollection: number;
}

export class AuditGuiaDetailUpdateDto {
	@ApiProperty({ type: [AuditGuiaDetailContentUpdateDto], description: 'Detalles de la auditoría' })
	@IsArray({ message: 'El campo "auditGuiaDetails" debe ser un arreglo de detalles' })
	// @ArrayNotEmpty({ message: 'El arreglo de detalles no puede estar vacío' })
	@ValidateNested({ each: true, message: 'Cada detalle de la auditoría debe ser válido' })
	@Type(() => AuditGuiaDetailContentUpdateDto)
	auditGuiaDetails: AuditGuiaDetailContentUpdateDto[];
}

export class AuditGuiaConfirmUpdateDto extends AuditGuiaDetailUpdateDto {
	@ApiProperty({ description: 'Clave que indica la razón, debe ser "R" o "T"', enum: ['R', 'T'] })
	@IsIn(['R', 'T'], { message: 'La clave debe ser "R" o "T"' })
	giveReason: 'R' | 'T';

	@ApiProperty({ description: 'Comentario' })
	@IsString({ message: 'El comentario debe ser una cadena de caracteres' })
	comment: string;
}

export class UpdateReasonDto {
	@ApiProperty({ description: 'Clave que indica la razón, debe ser "R" o "T"', enum: ['R', 'T'] })
	@IsIn(['R', 'T'], { message: 'La clave debe ser "R" o "T"' })
	key: 'R' | 'T';
}

export class AuditGuiaQueryDto extends IntersectionType(
	PagerDto<AuditGuiaCreateDto>,
	PartialType(AuditGuiaCreateDto),
) { }
