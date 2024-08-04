import { IntersectionType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEmail, IsNumber } from 'class-validator';
import { PagerDto } from 'src/core/common/dto/pager.dto';

export class CollectionSiteCreateDto {
	@IsNotEmpty({ message: 'TipoSedeId es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'TipoSedeId debe ser un número.' })
	TipoSedeId: number;

	@IsNotEmpty({ message: 'PaisId es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'PaisId debe ser un número.' })
	PaisId: number;

	@IsNotEmpty({ message: 'CiudadId es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'CiudadId debe ser un número.' })
	CiudadId: number;

	@IsNotEmpty({ message: 'Nombre es obligatorio y debe ser un texto.' })
	@IsString({ message: 'Nombre debe ser un texto.' })
	Nombre: string;

	@IsOptional()
	@IsString({ message: 'Descripcion debe ser un texto.' })
	Descripcion?: string;

	@IsNotEmpty({ message: 'Nit es obligatorio y debe ser un texto.' })
	@IsString({ message: 'Nit debe ser un texto.' })
	Nit: string;

	@IsNotEmpty({ message: 'RazonSocial es obligatorio y debe ser un texto.' })
	@IsString({ message: 'RazonSocial debe ser un texto.' })
	RazonSocial: string;

	@IsNotEmpty({ message: 'Barrio es obligatorio y debe ser un texto.' })
	@IsString({ message: 'Barrio debe ser un texto.' })
	Barrio: string;

	@IsNotEmpty({ message: 'Direccion es obligatorio y debe ser un texto.' })
	@IsString({ message: 'Direccion debe ser un texto.' })
	Direccion: string;

	@IsOptional()
	@IsString({ message: 'Latitud debe ser un texto.' })
	Latitud?: string;

	@IsOptional()
	@IsString({ message: 'Longitud debe ser un texto.' })
	Longitud?: string;

	@IsNotEmpty({ message: 'NombreContacto es obligatorio y debe ser un texto.' })
	@IsString({ message: 'NombreContacto debe ser un texto.' })
	NombreContacto: string;

	@IsNotEmpty({ message: 'EmailContacto es obligatorio y debe ser un email válido.' })
	@IsEmail({}, { message: 'EmailContacto debe ser un email válido.' })
	EmailContacto: string;

	@IsNotEmpty({ message: 'CelContacto es obligatorio y debe ser un texto.' })
	@IsString({ message: 'CelContacto debe ser un texto.' })
	CelContacto: string;

	@IsNotEmpty({ message: 'ReferenciaWLL es obligatorio y debe ser un texto.' })
	@IsString({ message: 'ReferenciaWLL debe ser un texto.' })
	ReferenciaWLL: string;

	@IsNotEmpty({ message: 'ReferenciaPH es obligatorio y debe ser un texto.' })
	@IsString({ message: 'ReferenciaPH debe ser un texto.' })
	ReferenciaPH: string;
  }

export class CollectionSiteUpdateDto extends PartialType(CollectionSiteCreateDto) { }

export class CollectionSiteQueryDto extends IntersectionType(
	PagerDto<CollectionSiteCreateDto>,
	PartialType(CollectionSiteCreateDto),
) { }
