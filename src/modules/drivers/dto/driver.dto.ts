import { ApiProperty, IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import {
	IsEmail,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	MaxLength,
	ValidateIf,
} from 'class-validator';
import { isEmpty } from 'lodash';
import { PagerDto } from 'src/core/common/dto/pager.dto';


export class DriverDto {
	@ApiProperty({ description: 'Solicitud de Recogida', example: '123...' })
	@IsOptional()
	@IsString()
	@IsNotEmpty({ message: 'La solicitud de recogida no debe de estar vacío' })
	collectionRequestId: number;

	@ApiProperty({ description: 'Nombre', example: 'Jon Doe' })
	@IsString()
	@MaxLength(50, { message: 'El tamaño máximo de caracteres es de 50' })
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	name: string;

	@ApiProperty({ description: 'Celular' })
	@IsNumber()
	@MaxLength(10, { message: 'El tamaño máximo de caracteres es de 10' })
	cellphone: number = null;

	@ApiProperty({ description: 'Descripción', example: 'Jon Doe, usuario de prueba' })
	@IsString()
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	description: string = '';

	@ApiProperty({ description: 'Email', example: 'bqy.dev@qq.com' })
	@IsEmail()
	@ValidateIf((o) => !isEmpty(o.email))
	email: string;

	@ApiProperty({ description: 'Documento del conductor, debe ser un texto.' })
	@IsOptional()
	@IsString({ message: 'Documento debe ser un texto.' })
	@IsNotEmpty({ message: 'El documento no debe de estar vacío' })
	document: string;
}

export class DriverUpdateDto extends PartialType(DriverDto) {}

export class DriverQueryDto extends IntersectionType(
	PagerDto<DriverDto>,
	PartialType(DriverDto),
) { }
