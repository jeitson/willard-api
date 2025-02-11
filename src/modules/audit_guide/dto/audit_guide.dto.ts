import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, IsOptional, IsBoolean, IsArray, ArrayNotEmpty, ValidateNested, IsIn, ValidateIf, IsNotEmpty, IsEnum, IsNumber, IsDateString, Matches } from 'class-validator';
import { PagerDto } from 'src/core/common/dto/pager.dto';
import { AUDIT_GUIDE_STATUS } from 'src/core/constants/status.constant';
import { Reception } from 'src/modules/receptions/entities/reception.entity';

export class AuditGuideDetailCreateDto {
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

export class AuditGuideCreateDto {
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

	@ApiProperty({ type: [AuditGuideDetailCreateDto], description: 'Detalles de la auditoría' })
	@IsArray({ message: 'El campo "auditGuideDetails" debe ser un arreglo de detalles' })
	@ArrayNotEmpty({ message: 'El arreglo de detalles no puede estar vacío' })
	@ValidateNested({ each: true, message: 'Cada detalle de la auditoría debe ser válido' })
	@Type(() => AuditGuideDetailCreateDto)
	auditGuideDetails: AuditGuideDetailCreateDto[];
}

export class AuditGuideDetailContentUpdateDto {
	@ApiProperty({ description: 'ID del detalle de la auditoría', required: true })
	@IsInt({ message: 'El ID del detalle debe ser un número entero' })
	id: number;

	@ApiProperty({ description: 'Cantidad Corregida', required: true })
	@IsInt({ message: 'La cantidad corregida debe ser un número entero' })
	quantityCollection: number;

	@ApiProperty({
		description: 'Producto relacionado con el detalle',
		required: false,
		nullable: true,
	})
	@ValidateIf((dto) => dto.productId !== undefined) // Solo valida si productId está presente
	@IsInt({ message: 'El producto debe ser un número entero válido' })
	productId?: number | null;

	@ApiProperty({
		description: 'Tipo de detalle (R o T)',
		required: false,
		nullable: true,
		enum: ['R', 'T'],
	})
	@ValidateIf((dto) => dto.type !== undefined) // Solo valida si type está presente
	@IsIn(['R', 'T'], { message: 'El tipo debe ser "R" o "T"' })
	type?: 'R' | 'T' | null;
}

export class AuditGuideDetailUpdateDto {
	@ApiProperty({ type: [AuditGuideDetailContentUpdateDto], description: 'Detalles de la auditoría' })
	@IsArray({ message: 'El campo "auditGuideDetails" debe ser un arreglo de detalles' })
	// @ArrayNotEmpty({ message: 'El arreglo de detalles no puede estar vacío' })
	@ValidateNested({ each: true, message: 'Cada detalle de la auditoría debe ser válido' })
	@Type(() => AuditGuideDetailContentUpdateDto)
	auditGuideDetails: AuditGuideDetailContentUpdateDto[];
}

export class AuditGuideConfirmUpdateDto extends AuditGuideDetailUpdateDto {
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

export class AuditGuideQueryDto extends IntersectionType(PagerDto) {
	@ApiProperty({ description: 'Número de guía' })
	@IsOptional()
	@IsString({ message: 'El número de guía debe ser una cadena de caracteres' })
	guideNumber?: string;

	@ApiProperty({ description: 'Fecha (formato YYYY-MM-DD)', example: '2024-02-20' })
	@IsOptional()
	@Matches(/^\d{4}-\d{2}-\d{2}$/, {
		message: 'La fecha debe estar en formato YYYY-MM-DD (por ejemplo, 2024-02-20)',
	})
	date?: string;

	@ApiProperty({
		description: 'Estado de la guía',
		enum: AUDIT_GUIDE_STATUS,
		example: AUDIT_GUIDE_STATUS.WITHOUT_GUIDE,
	})
	@IsOptional()
	@IsNotEmpty({ message: 'El campo estado no puede estar vacío.' })
	@IsEnum(AUDIT_GUIDE_STATUS, {
		message: `El estado debe ser uno de los siguientes: ${Object.values(AUDIT_GUIDE_STATUS).join(', ')}`,
	})
	requestStatus?: AUDIT_GUIDE_STATUS; // Usa el tipo de la enumeración
}
