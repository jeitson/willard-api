import { ApiProperty, IntersectionType, PartialType, PickType } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsInt } from "class-validator";
import { PagerDto } from "src/core/common/dto/pager.dto";

export class PickUpLocationCreateDto {

	@ApiProperty({ description: 'Tipo de Lugar' })
	@IsNotEmpty({ message: 'El TipoLugarId no puede estar vacío.' })
	@IsInt({ message: 'El TipoLugarId debe ser un número entero.' })
	placeTypeId: number;

	@ApiProperty({ description: 'Cliente asociado' })
	@IsNotEmpty({ message: 'El ClienteId no puede estar vacío.' })
	@IsInt({ message: 'El ClienteId debe ser un número entero.' })
	clientId: number;

	@ApiProperty({ description: 'Sede de Acopio asociada' })
	@IsNotEmpty({ message: 'El SedeAcopioId no puede estar vacío.' })
	@IsInt({ message: 'El SedeAcopioId debe ser un número entero.' })
	collectionSiteId: number;

	@ApiProperty({ description: 'Asesor asociado' })
	@IsNotEmpty({ message: 'El AsesorId no puede estar vacío.' })
	@IsInt({ message: 'El AsesorId debe ser un número entero.' })
	consultantId: number;

	@ApiProperty({ description: 'Ciudad' })
	@IsNotEmpty({ message: 'El CiudadId no puede estar vacío.' })
	@IsInt({ message: 'El CiudadId debe ser un número entero.' })
	cityId: number;

	@ApiProperty({ description: 'Zona' })
	@IsNotEmpty({ message: 'El ZonaId no puede estar vacío.' })
	@IsInt({ message: 'El ZonaId debe ser un número entero.' })
	zoneId: number;

	@ApiProperty({ description: 'Nombre' })
	@IsNotEmpty({ message: 'El Nombre no puede estar vacío.' })
	@IsString({ message: 'El Nombre debe ser una cadena de texto.' })
	name: string;

	@ApiProperty({ description: 'Descripción' })
	@IsOptional()
	@IsString({ message: 'La Descripcion debe ser una cadena de texto.' })
	description?: string;

	@ApiProperty({ description: 'Barrio' })
	@IsNotEmpty({ message: 'El Barrio no puede estar vacío.' })
	@IsString({ message: 'El Barrio debe ser una cadena de texto.' })
	neighborhood: string;

	@ApiProperty({ description: 'Dirección' })
	@IsNotEmpty({ message: 'La Direccion no puede estar vacía.' })
	@IsString({ message: 'La Direccion debe ser una cadena de texto.' })
	address: string;

	@ApiProperty({ description: 'Latitud' })
	@IsOptional()
	@IsString({ message: 'La Latitud debe ser una cadena de texto.' })
	latitude?: string;

	@ApiProperty({ description: 'Longitud' })
	@IsOptional()
	@IsString({ message: 'La Longitud debe ser una cadena de texto.' })
	longitude?: string;

	@ApiProperty({ description: 'Nombre del contacto' })
	@IsNotEmpty({ message: 'El NombreContacto no puede estar vacío.' })
	@IsString({ message: 'El NombreContacto debe ser una cadena de texto.' })
	contactName: string;

	@ApiProperty({ description: 'Email del contacto' })
	@IsNotEmpty({ message: 'El EmailContacto no puede estar vacío.' })
	@IsString({ message: 'El EmailContacto debe ser una cadena de texto.' })
	contactEmail: string;

	@ApiProperty({ description: 'Teléfono del contacto' })
	@IsNotEmpty({ message: 'El CelContacto no puede estar vacío.' })
	@IsString({ message: 'El CelContacto debe ser una cadena de texto.' })
	contactPhone: string;

	@ApiProperty({ description: 'Referencia WLL' })
	@IsOptional()
	@IsString({ message: 'La ReferenciaWLL debe ser una cadena de texto.' })
	referenceWLL?: string;

	@ApiProperty({ description: 'Referencia PH' })
	@IsOptional()
	@IsString({ message: 'La ReferenciaPH debe ser una cadena de texto.' })
	referencePH?: string;
}

export class PickUpLocationUpdateDto extends PartialType(PickUpLocationCreateDto) { }

export class PickUpLocationQueryDto extends IntersectionType(
	PagerDto<PickUpLocationCreateDto>,
	PartialType(PickUpLocationCreateDto),
) { }
