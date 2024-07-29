import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
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
import { Column } from 'typeorm';

export class ChildDto {
	@Column({ type: 'bigint' })
	PadreId: string;

	@ApiProperty({ description: 'Codigo del Padre' })
	@IsString()
	@MaxLength(50, { message: 'El tamaño máximo de caracteres es de 50' })
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	CodigoCatalogo: string;

	@ApiProperty({ description: 'Nombre', example: 'Administrador' })
	@IsString()
	@MaxLength(50, { message: 'El tamaño máximo de caracteres es de 50' })
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	Nombre: string;

	@ApiProperty({ description: 'Descripción', example: 'Descripicón del hijo' })
	@IsString()
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	Descripcion: string = '';

	@ApiProperty({ description: 'Orden', example: 'Orden de los items' })
	@IsOptional()
	@IsInt()
	Orden?: number = null;

	@ApiProperty({ description: 'Extra 1' })
	@IsOptional()
	@IsString()
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	Extra1: string = '';

	@ApiProperty({ description: 'Extra 2' })
	@IsOptional()
	@IsString()
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	Extra2: string = '';

	@ApiProperty({ description: 'Extra 3' })
	@IsOptional()
	@IsString()
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	Extra3: string = '';

	@ApiProperty({ description: 'Extra 4' })
	@IsOptional()
	@IsString()
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	Extra4: string = '';

	@ApiProperty({ description: 'Extra 5' })
	@IsOptional()
	@IsString()
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	Extra5: string = '';
}

export class ChildUpdateDto extends PartialType(ChildDto) { }

export class ChildQueryDto extends IntersectionType(
	PagerDto<ChildDto>,
	PartialType(ChildDto),
) { }


export class ChildSearchDto {
	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	keys: string[] = ['']
}
