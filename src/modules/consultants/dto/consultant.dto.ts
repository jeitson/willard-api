import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEmail, IsNumber } from 'class-validator';
import { PagerDto } from 'src/core/common/dto/pager.dto';

export class ConsultantCreateDto {
	@ApiProperty({ description: 'Nombre del asesor, debe ser un texto.' })
	@IsNotEmpty({ message: 'Nombre es obligatorio y debe ser un texto.' })
	@IsString({ message: 'Nombre debe ser un texto.' })
	name: string;

	@ApiProperty({ description: 'Email del asesor, debe ser un email válido.' })
	@IsNotEmpty({ message: 'Email es obligatorio y debe ser un email válido.' })
	@IsEmail({}, { message: 'Email debe ser un email válido.' })
	email: string;

	@ApiProperty({ description: 'Celular del asesor, debe ser un texto.' })
	@IsNotEmpty({ message: 'Cel es obligatorio y debe ser un texto.' })
	@IsString({ message: 'Cel debe ser un texto.' })
	phone: string;

	@ApiProperty({ description: 'Descripción del asesor, opcional, debe ser un texto.' })
	@IsOptional()
	@IsString({ message: 'Descripcion debe ser un texto.' })
	description?: string;

	@ApiProperty({ description: 'Referencia PH del asesor, debe ser un texto.' })
	@IsNotEmpty({ message: 'ReferenciaPH es obligatorio y debe ser un texto.' })
	@IsString({ message: 'ReferenciaPH debe ser un texto.' })
	referencePH: string;
}

export class ConsultantUpdateDto extends PartialType(ConsultantCreateDto) { }

export class ConsultantQueryDto extends IntersectionType(
	PagerDto<ConsultantCreateDto>,
	PartialType(ConsultantCreateDto),
) { }
