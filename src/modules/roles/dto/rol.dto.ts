import { ApiProperty, IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsString,
	MaxLength,
} from 'class-validator';

import { PagerDto } from 'src/core/common/dto/pager.dto';

export class RolDto {
	@ApiProperty({ description: 'Nombre', example: 'Administrador' })
	@IsString()
	@MaxLength(50, { message: 'El tamaño máximo de caracteres es de 50' })
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	name: string;

	@ApiProperty({ description: 'Descripción', example: 'Rol aplicado a los usuarios administrativos' })
	@IsString()
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	description: string = '';
}

export class RolUpdateDto extends PartialType(RolDto) { }

export class RolQueryDto extends IntersectionType(
	PagerDto<RolDto>,
	PartialType(OmitType(RolDto, ['description'])),
) { }
