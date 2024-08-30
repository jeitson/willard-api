import { ApiProperty, IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
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
	title: string;

	@ApiProperty({ description: 'Descripción', example: 'Descripción de la auditoría' })
	@IsString()
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	description: string = '';

	@ApiProperty({ description: 'Respuesta', example: 'Respuesta de la auditoría' })
	@IsString()
	@MaxLength(8000, { message: 'El tamaño máximo de caracteres es de 8000' })
	response: string = null;

	@ApiProperty({ description: 'Peticion', example: 'Petición de la auditoría' })
	@IsString()
	@MaxLength(8000, { message: 'El tamaño máximo de caracteres es de 8000' })
	payload: string = null;

	@ApiProperty({ description: 'CodigoEstado', example: 'Codigo de respuesta' })
	@IsString()
	@MaxLength(10, { message: 'El tamaño máximo de caracteres es de 10' })
	statusCode: string = null;

	@ApiProperty({ description: 'Metodo', example: 'Metodo de la petición' })
	@IsString()
	@MaxLength(10, { message: 'El tamaño máximo de caracteres es de 10' })
	method: string = null;
}

export class AuditQueryDto extends IntersectionType(
	PagerDto<AuditDto>,
	PartialType(OmitType(AuditDto, ['description'])),
) { }
