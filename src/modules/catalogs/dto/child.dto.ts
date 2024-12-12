import { ApiProperty, IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import {
	ArrayNotEmpty,
	IsArray,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
} from 'class-validator';

import { PagerDto } from 'src/core/common/dto/pager.dto';

export class ChildDto {
	@ApiProperty({ description: 'Codigo del Padre' })
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(50, { message: 'El tamaño máximo de caracteres es de 50' })
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	catalogCode: string;

	@ApiProperty({ description: 'ID del padre' })
	parentId: number;

	@ApiProperty({ description: 'Nombre', example: 'Administrador' })
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(50, { message: 'El tamaño máximo de caracteres es de 50' })
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	name: string;

	@ApiProperty({ description: 'Descripción', example: 'Descripicón del hijo' })
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	description: string = '';

	@ApiProperty({ description: 'Orden', example: 'Orden de los items' })
	@IsOptional()
	@IsInt({ message: 'Debe de ser un número' })
	order?: number = null;

	@ApiProperty({ description: 'Extra 1' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	extra1: string = '';

	@ApiProperty({ description: 'Extra 2' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	extra2: string = '';

	@ApiProperty({ description: 'Extra 3' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	extra3: string = '';

	@ApiProperty({ description: 'Extra 4' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	extra4: string = '';

	@ApiProperty({ description: 'Extra 5' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	extra5: string = '';
}

export class ChildUpdateDto extends PartialType(ChildDto) { }

export class ChildQueryDto extends IntersectionType(
	PagerDto<ChildDto>,
	PartialType(OmitType(ChildDto, ['extra1', 'extra2', 'extra3', 'extra4', 'extra5', 'description', 'order'])),
) { }


export class ChildSearchDto {
	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	keys: string[] = ['']
}
