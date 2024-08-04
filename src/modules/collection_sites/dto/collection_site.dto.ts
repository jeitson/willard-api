import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEmail, IsNumber } from 'class-validator';
import { PagerDto } from 'src/core/common/dto/pager.dto';

export class CollectionSiteCreateDto {
	@ApiProperty({ description: 'ID del tipo de sede, debe ser un número.' })
	@IsNotEmpty({ message: 'TipoSedeId es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'TipoSedeId debe ser un número.' })
	TipoSedeId: number;

	@ApiProperty({ description: 'ID del país, debe ser un número.' })
	@IsNotEmpty({ message: 'PaisId es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'PaisId debe ser un número.' })
	PaisId: number;

	@ApiProperty({ description: 'ID de la ciudad, debe ser un número.' })
	@IsNotEmpty({ message: 'CiudadId es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'CiudadId debe ser un número.' })
	CiudadId: number;

	@ApiProperty({ description: 'Nombre de la sede, debe ser un texto.' })
	@IsNotEmpty({ message: 'Nombre es obligatorio y debe ser un texto.' })
	@IsString({ message: 'Nombre debe ser un texto.' })
	Nombre: string;

	@ApiProperty({ description: 'Descripción de la sede, opcional, debe ser un texto.' })
	@IsOptional()
	@IsString({ message: 'Descripcion debe ser un texto.' })
	Descripcion?: string;

	@ApiProperty({ description: 'NIT de la sede, debe ser un texto.' })
	@IsNotEmpty({ message: 'Nit es obligatorio y debe ser un texto.' })
	@IsString({ message: 'Nit debe ser un texto.' })
	Nit: string;

	@ApiProperty({ description: 'Razón social de la sede, debe ser un texto.' })
	@IsNotEmpty({ message: 'RazonSocial es obligatorio y debe ser un texto.' })
	@IsString({ message: 'RazonSocial debe ser un texto.' })
	RazonSocial: string;

	@ApiProperty({ description: 'Barrio de la sede, debe ser un texto.' })
	@IsNotEmpty({ message: 'Barrio es obligatorio y debe ser un texto.' })
	@IsString({ message: 'Barrio debe ser un texto.' })
	Barrio: string;

	@ApiProperty({ description: 'Dirección de la sede, debe ser un texto.' })
	@IsNotEmpty({ message: 'Direccion es obligatorio y debe ser un texto.' })
	@IsString({ message: 'Direccion debe ser un texto.' })
	Direccion: string;

	@ApiProperty({ description: 'Latitud de la sede, opcional, debe ser un texto.' })
	@IsOptional()
	@IsString({ message: 'Latitud debe ser un texto.' })
	Latitud?: string;

	@ApiProperty({ description: 'Longitud de la sede, opcional, debe ser un texto.' })
	@IsOptional()
	@IsString({ message: 'Longitud debe ser un texto.' })
	Longitud?: string;

	@ApiProperty({ description: 'Nombre del contacto, debe ser un texto.' })
	@IsNotEmpty({ message: 'NombreContacto es obligatorio y debe ser un texto.' })
	@IsString({ message: 'NombreContacto debe ser un texto.' })
	NombreContacto: string;

	@ApiProperty({ description: 'Email del contacto, debe ser un email válido.' })
	@IsNotEmpty({ message: 'EmailContacto es obligatorio y debe ser un email válido.' })
	@IsEmail({}, { message: 'EmailContacto debe ser un email válido.' })
	EmailContacto: string;

	@ApiProperty({ description: 'Celular del contacto, debe ser un texto.' })
	@IsNotEmpty({ message: 'CelContacto es obligatorio y debe ser un texto.' })
	@IsString({ message: 'CelContacto debe ser un texto.' })
	CelContacto: string;

	@ApiProperty({ description: 'Referencia WLL de la sede, debe ser un texto.' })
	@IsNotEmpty({ message: 'ReferenciaWLL es obligatorio y debe ser un texto.' })
	@IsString({ message: 'ReferenciaWLL debe ser un texto.' })
	ReferenciaWLL: string;

	@ApiProperty({ description: 'Referencia PH de la sede, debe ser un texto.' })
	@IsNotEmpty({ message: 'ReferenciaPH es obligatorio y debe ser un texto.' })
	@IsString({ message: 'ReferenciaPH debe ser un texto.' })
	ReferenciaPH: string;
}

export class CollectionSiteUpdateDto extends PartialType(CollectionSiteCreateDto) { }

export class CollectionSiteQueryDto extends IntersectionType(
	PagerDto<CollectionSiteCreateDto>,
	PartialType(CollectionSiteCreateDto),
) { }
