import { IsString, IsNotEmpty, IsOptional, IsInt, IsArray, IsDateString, ArrayMinSize, ValidateNested, MaxLength, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDetailDto {
	@IsString({ message: 'El tipo de batería debe ser un texto.' })
	@IsNotEmpty({ message: 'El campo tipoBat no puede estar vacío.' })
	@MaxLength(10, { message: 'El campo tipoBat no debe exceder los 10 caracteres.' })
	tipoBat: string;

	@IsInt({ message: 'La cantidad debe ser un número entero.' })
	@Min(1, { message: 'La cantidad mínima debe ser 1.' })
	cantidades: number;
}

export class RegisterDto {
	@IsString({ message: 'El ID de la ruta debe ser un texto.' })
	@IsNotEmpty({ message: 'El campo idRuta no puede estar vacío.' })
	@MaxLength(10, { message: 'El campo idRuta no debe exceder los 10 caracteres.' })
	idRuta: string;

	@IsString({ message: 'El ID de la guía debe ser un texto.' })
	@IsNotEmpty({ message: 'El campo idGuia no puede estar vacío.' })
	@MaxLength(10, { message: 'El campo idGuia no debe exceder los 10 caracteres.' })
	idGuia: string;

	@IsString({ message: 'El tipo de movimiento debe ser un texto.' })
	@IsNotEmpty({ message: 'El campo tipo no puede estar vacío.' })
	@IsEnum(['RECOGIDA', 'ENTREGA', 'TRANSBORDO'], { message: 'Solamente se permite estos tipos: RECOGIDA, ENTREGA, TRANSBORDO' })
	tipo: string;  // RECOGIDA, ENTREGA, TRANSBORDO

	@IsInt({ message: 'La secuencia debe ser un número entero.' })
	@Min(1, { message: 'La secuencia mínima debe ser 1.' })
	secuencia: number;

	@IsDateString({}, { message: 'El campo fechaMov debe ser una fecha válida en formato ISO.' })
	fechaMov: string;

	@IsString({ message: 'El campo horaMov debe ser un texto.' })
	horaMov: string;

	@IsInt({ message: 'El planeador debe ser un número entero.' })
	@Min(1, { message: 'El valor mínimo para el planeador es 1.' })
	planeador: number;

	@IsString({ message: 'El campo zona debe ser un texto.' })
	@IsNotEmpty({ message: 'El campo zona no puede estar vacío.' })
	@MaxLength(50, { message: 'El campo zona no debe exceder los 50 caracteres.' })
	zona: string;

	@IsString({ message: 'El campo ciudad debe ser un texto.' })
	@IsNotEmpty({ message: 'El campo ciudad no puede estar vacío.' })
	@MaxLength(50, { message: 'El campo ciudad no debe exceder los 50 caracteres.' })
	ciudad: string;

	@IsString({ message: 'El campo depto debe ser un texto.' })
	@IsNotEmpty({ message: 'El campo depto no puede estar vacío.' })
	@MaxLength(50, { message: 'El campo depto no debe exceder los 50 caracteres.' })
	depto: string;

	@IsString({ message: 'El campo placa debe ser un texto.' })
	@IsNotEmpty({ message: 'El campo placa no puede estar vacío.' })
	@MaxLength(10, { message: 'El campo placa no debe exceder los 10 caracteres.' })
	placa: string;

	@IsString({ message: 'El nombre del conductor debe ser un texto.' })
	@IsNotEmpty({ message: 'El campo conductor no puede estar vacío.' })
	@MaxLength(100, { message: 'El campo conductor no debe exceder los 100 caracteres.' })
	conductor: string;

	@IsString({ message: 'El nombre del sitio debe ser un texto.' })
	@IsNotEmpty({ message: 'El campo nombreSitio no puede estar vacío.' })
	@MaxLength(100, { message: 'El campo nombreSitio no debe exceder los 100 caracteres.' })
	nombreSitio: string;

	@IsString({ message: 'El campo dirección debe ser un texto.' })
	@IsNotEmpty({ message: 'El campo direccion no puede estar vacío.' })
	@MaxLength(100, { message: 'El campo direccion no debe exceder los 100 caracteres.' })
	direccion: string;

	@IsString({ message: 'El campo posGps debe ser un texto.' })
	@IsNotEmpty({ message: 'El campo posGps no puede estar vacío.' })
	@MaxLength(15, { message: 'El campo posGps no debe exceder los 15 caracteres.' })
	posGps: string;

	@IsInt({ message: 'El total de cantidades debe ser un número entero.' })
	@Min(1, { message: 'El valor mínimo para totCant es 1.' })
	totCant: number;

	@IsString({ message: 'El campo docReferencia debe ser un texto.' })
	@IsNotEmpty({ message: 'El campo docReferencia no puede estar vacío.' })
	@MaxLength(50, { message: 'El campo docReferencia no debe exceder los 50 caracteres.' })
	docReferencia: string;

	@IsOptional()
	@IsString({ message: 'El campo docReferencia2 debe ser un texto.' })
	@MaxLength(50, { message: 'El campo docReferencia2 no debe exceder los 50 caracteres.' })
	docReferencia2: string;

	@IsArray({ message: 'El campo urlSoportes debe ser un arreglo de URLs.' })
	@IsOptional()
	urlSoportes: string[];

	@IsArray({ message: 'El campo detalles debe ser un arreglo.' })
	@ArrayMinSize(1, { message: 'Debe proporcionar al menos un detalle.' })
	@ValidateNested({ each: true, message: 'Cada detalle debe ser válido.' })
	@Type(() => RegisterDetailDto)
	detalles: RegisterDetailDto[];
}
