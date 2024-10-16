export class CreateRegisterDto { }


import { IsString, IsNotEmpty, IsOptional, IsInt, IsArray, IsDateString, ArrayMinSize, ValidateNested, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDetailDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(10)
	tipoBat: string;

	@IsInt()
	@Min(1)
	cantidades: number;
}

export class RegisterDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(10)
	idRuta: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(10)
	idGuia: string;

	@IsString()
	@IsNotEmpty()
	tipo: string;  // RECOGIDA, ENTREGA, TRANSBORDO

	@IsInt()
	@Min(1)
	secuencia: number;

	@IsDateString()
	fechaMov: string;

	@IsString()
	horaMov: string;

	@IsInt()
	@Min(1)
	planeador: number;

	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	zona: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	ciudad: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	depto: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(10)
	placa: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	conductor: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	nombreSitio: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	direccion: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(15)
	posGps: string;

	@IsInt()
	@Min(1)
	totCant: number;

	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	docReferencia: string;

	@IsOptional()
	@IsString()
	@MaxLength(50)
	docReferencia2: string;

	@IsArray()
	@IsOptional()
	urlSoportes: string[];

	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => RegisterDetailDto)
	detalles: RegisterDetailDto[];
}
