import { ApiProperty, IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import {
	IsArray,
	IsNotEmpty,
	IsString,
	MaxLength,
} from 'class-validator';

import { PagerDto } from 'src/core/common/dto/pager.dto';

export class RolDto {
	@ApiProperty({ description: 'Nombre', example: 'Administrador' })
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(50, { message: 'El tamaño máximo de caracteres es de 50' })
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	name: string;

	@ApiProperty({ description: 'Descripción', example: 'Rol aplicado a los usuarios administrativos' })
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	description: string = '';

	@ApiProperty({ description: 'JSON Menú', example: [] })
	@IsArray()
	menu: any = null;
}

export class RolUpdateDto extends PartialType(RolDto) { }

export class RolQueryDto extends IntersectionType(
	PagerDto<RolDto>,
	PartialType(OmitType(RolDto, ['description'])),
) { }
