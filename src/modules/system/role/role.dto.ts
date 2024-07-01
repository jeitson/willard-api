import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
	IsArray,
	IsIn,
	IsOptional,
	IsString,
	Matches,
	MinLength,
} from 'class-validator';

export class RoleDto {
	@ApiProperty({ description: 'Nombre del rol' })
	@IsString()
	@MinLength(2, {
		message: 'El nombre del rol debe tener al menos 2 caracteres',
	})
	name: string;

	@ApiProperty({
		description:
			'Valor único para identificar el rol (solo letras y números)',
	})
	@IsString()
	@Matches(/^[a-zA-Z0-9]+$/, {
		message: 'El valor del rol solo puede contener letras y números',
	})
	@MinLength(2, {
		message: 'El valor del rol debe tener al menos 2 caracteres',
	})
	value: string;

	@ApiProperty({ description: 'Comentario opcional sobre el rol' })
	@IsString()
	@IsOptional()
	remark?: string;

	@ApiProperty({
		description:
			'Lista de IDs de menús o permisos asociados al rol (opcional)',
	})
	@IsOptional()
	@IsArray()
	menuIds?: number[];
}

export class RoleUpdateDto extends PartialType(RoleDto) {}
