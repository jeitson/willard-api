import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDecimal, IsBoolean, IsEmail } from 'class-validator';
import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';

import { PagerDto } from 'src/core/common/dto/pager.dto';

export class TransporterCreateDto {
	@ApiProperty({ description: 'Nombre del transportador, debe ser un texto.' })
	@IsNotEmpty({ message: 'Nombre es obligatorio y debe ser un texto.' })
	@IsString({ message: 'Nombre debe ser un texto.' })
	name: string;

	@ApiProperty({ description: 'NIT del transportador, debe ser un texto.' })
	@IsNotEmpty({ message: 'Nit es obligatorio y debe ser un texto.' })
	@IsString({ message: 'Nit debe ser un texto.' })
	taxId: string;

	@ApiProperty({ description: 'Razón Social del transportador, debe ser un texto.' })
	@IsNotEmpty({ message: 'RazonSocial es obligatorio y debe ser un texto.' })
	@IsString({ message: 'RazonSocial debe ser un texto.' })
	businessName: string;

	@ApiProperty({ description: 'Descripción del transportador, opcional, debe ser un texto.' })
	@IsOptional()
	@IsString({ message: 'Descripcion debe ser un texto.' })
	description?: string;

	@ApiProperty({ description: 'Nombre del contacto, debe ser un texto.' })
	@IsNotEmpty({ message: 'NombreContacto es obligatorio y debe ser un texto.' })
	@IsString({ message: 'NombreContacto debe ser un texto.' })
	contactName: string;

	@ApiProperty({ description: 'Email del contacto, debe ser un email válido.' })
	@IsNotEmpty({ message: 'EmailContacto es obligatorio y debe ser un email válido.' })
	@IsEmail({}, { message: 'EmailContacto debe ser un email válido.' })
	contactEmail: string;

	@ApiProperty({ description: 'Referencia WLL del transportador, debe ser un texto.' })
	@IsNotEmpty({ message: 'ReferenciaWLL es obligatorio y debe ser un texto.' })
	@IsString({ message: 'ReferenciaWLL debe ser un texto.' })
	referenceWLL: string;

	@ApiProperty({ description: 'Referencia PH del transportador, debe ser un texto.' })
	@IsNotEmpty({ message: 'ReferenciaPH es obligatorio y debe ser un texto.' })
	@IsString({ message: 'ReferenciaPH debe ser un texto.' })
	referencePH: string;
}

export class TransporterUpdateDto extends PartialType(TransporterCreateDto) { }

export class TransporterQueryDto extends IntersectionType(
	PagerDto<TransporterCreateDto>,
	PartialType(TransporterCreateDto),
) { }
