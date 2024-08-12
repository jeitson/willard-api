import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import {
	IsInt,
	IsNotEmpty,
	IsString,
	MaxLength,
} from 'class-validator';

import { PagerDto } from 'src/core/common/dto/pager.dto';

export class AuditDto {
	@ApiProperty({ description: 'Usuario', example: '1' })
	@IsInt()
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	userId: string;

	@ApiProperty({ description: 'Nombre', example: 'Auditoría - ACC1' })
	@IsString()
	@MaxLength(50, { message: 'El tamaño máximo de caracteres es de 50' })
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	name: string;

	@ApiProperty({ description: 'Descripción', example: 'Descripción de la auditoría' })
	@IsString()
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	description: string = '';
}

export class AuditQueryDto extends IntersectionType(
	PagerDto<AuditDto>,
	PartialType(AuditDto),
) { }
