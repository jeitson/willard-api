import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';

import { PagerDto } from 'src/core/common/dto/pager.dto';

export class ClientCreateDto {
	@ApiProperty({ description: 'Nombre del cliente, debe ser un texto.' })
	@IsNotEmpty({ message: 'Nombre es obligatorio y debe ser un texto.' })
	@IsString({ message: 'Nombre debe ser un texto.' })
	name: string;

	@ApiProperty({ description: 'Descripción del cliente, opcional, debe ser un texto.' })
	@IsOptional()
	@IsString({ message: 'Descripcion debe ser un texto.' })
	description?: string;

	@ApiProperty({ description: 'Razón social del cliente, debe ser un texto.' })
	@IsNotEmpty({ message: 'RazonSocial es obligatorio y debe ser un texto.' })
	@IsString({ message: 'RazonSocial debe ser un texto.' })
	businessName: string;

	@ApiProperty({ description: 'ID del tipo de documento, debe ser un número.' })
	@IsNotEmpty({ message: 'TipoDocumentoId es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'TipoDocumentoId debe ser un número.' })
	documentTypeId: number;

	@ApiProperty({ description: 'ID del país, debe ser un número.' })
	@IsNotEmpty({ message: 'PaisId es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'PaisId debe ser un número.' })
	countryId: number;

	@ApiProperty({ description: 'Número del documento, debe ser un texto.' })
	@IsNotEmpty({ message: 'NumeroDocumento es obligatorio y debe ser un texto.' })
	@IsString({ message: 'NumeroDocumento debe ser un texto.' })
	documentNumber: string;

	@ApiProperty({ description: 'Referencia WLL del cliente, debe ser un texto.' })
	@IsNotEmpty({ message: 'ReferenciaWLL es obligatorio y debe ser un texto.' })
	@IsString({ message: 'ReferenciaWLL debe ser un texto.' })
	referenceWLL: string;

	@ApiProperty({ description: 'Referencia PH del cliente, debe ser un texto.' })
	@IsNotEmpty({ message: 'ReferenciaPH es obligatorio y debe ser un texto.' })
	@IsString({ message: 'ReferenciaPH debe ser un texto.' })
	referencePH: string;
}


export class ClientUpdateDto extends PartialType(ClientCreateDto) { }

export class ClientQueryDto extends IntersectionType(
	PagerDto<ClientCreateDto>,
	PartialType(ClientCreateDto),
) { }
