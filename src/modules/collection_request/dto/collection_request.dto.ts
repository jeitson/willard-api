import { ApiProperty, IntersectionType, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, IsNumber, MaxLength, ValidateIf, Min, IsNotEmpty, IsArray } from "class-validator";
import { PagerDto } from "src/core/common/dto/pager.dto";

export class CollectionRequestCreateDto {
	@ApiProperty({ description: 'Cliente asociado' })
	@IsInt({ message: 'Debe de ser un número' })
	@Min(1, { message: 'El ID del cliente no puede ser 0' })
	clientId: number;

	@ApiProperty({ description: 'Lugar de recogida asociado' })
	@IsInt({ message: 'Debe de ser un número' })
	@Min(1, { message: 'El ID del lugar de recogida no puede ser 0' })
	pickUpLocationId: number;

	@ApiProperty({ description: 'ID\'s de los productos, debe ser un número.' })
	@IsNotEmpty({ message: 'Productos es obligatorio.' })
	@IsArray({ message: 'ProductoId debe ser un array de número.' })
	products: number[];

	@ApiProperty({ description: 'Descripción' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255)
	description?: string;

	@ApiProperty({ description: 'ID del motivo especial, debe ser un número.' })
	@IsNotEmpty({ message: 'MotivoEspecial es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'MotivoEspecial debe ser un número.' })
	motiveSpecialId: number = null;

	@ApiProperty({ description: 'Cantidad estimada' })
	@IsNumber()
	estimatedQuantity: number;

	@ApiProperty({ description: 'KG estimados' })
	@IsNumber()
	estimatedKG: number;

	@ApiProperty({ description: 'Es especial' })
	@IsBoolean()
	isSpecial: boolean;

	@ApiProperty({ description: 'Fecha estimada de recogida' })
	@IsOptional()
	@IsDateString()
	estimatedPickUpDate?: string;

	@ApiProperty({ description: 'Hora estimada de recogida' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	estimatedPickUpTime?: string;

	@ApiProperty({ description: 'Observaciones' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255)
	observations?: string;

	@ApiProperty({ description: 'Recomendaciones' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255)
	recommendations?: string;

	@ApiProperty({ description: 'Transportadora asociada' })
	@IsOptional()
	transporterId: number = null;
}

export class CollectionRequestCompleteDto {
	@ApiProperty({ description: 'Sede de acopio' })
	@IsInt({ message: 'Debe de ser un número' })
	@Min(1, { message: 'El ID de la sede de acopio no puede ser 0' })
	collectionSiteId: number;

	@ApiProperty({ description: 'Asesor' })
	@IsInt({ message: 'Debe de ser un número' })
	@Min(1, { message: 'El ID del asesor no puede ser 0' })
	consultantId: number;

	@ApiProperty({ description: 'Transportadora asociada' })
	@IsOptional()
	@IsInt({ message: 'Debe de ser un número' })
	transporterId: number = null;
}

export class CollectionRequestUpdateDto {
	@ApiProperty({ description: 'Cliente asociado' })
	@IsInt({ message: 'Debe de ser un número' })
	@Min(1, { message: 'El ID del cliente no puede ser 0' })
	clientId: number;

	@ApiProperty({ description: 'Lugar de recogida asociado' })
	@IsInt({ message: 'Debe de ser un número' })
	@Min(1, { message: 'El ID del lugar de recogida no puede ser 0' })
	pickUpLocationId: number;

	@ApiProperty({ description: 'ID\'s de los productos, debe ser un número.' })
	@IsNotEmpty({ message: 'Productos es obligatorio.' })
	@IsArray({ message: 'ProductoId debe ser un array de número.' })
	products: number[];

	@ApiProperty({ description: 'Nombre' })
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(50)
	name: string;

	@ApiProperty({ description: 'Descripción' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255)
	description?: string;

	@ApiProperty({ description: 'ID del motivo especial, debe ser un número.' })
	@IsNotEmpty({ message: 'MotivoEspecial es obligatorio y debe ser un número.' })
	@IsNumber({}, { message: 'MotivoEspecial debe ser un número.' })
	motiveSpecialId: number = null;

	@ApiProperty({ description: 'Fecha de solicitud' })
	@IsDateString()
	requestDate: string;

	@ApiProperty({ description: 'Hora de solicitud' })
	@IsString({ message: 'Debe de ser un texto' })
	requestTime: string;

	@ApiProperty({ description: 'Cantidad estimada' })
	@IsNumber()
	estimatedQuantity: number;

	@ApiProperty({ description: 'KG estimados' })
	@IsNumber()
	estimatedKG: number;

	@ApiProperty({ description: 'Fecha estimada de recogida' })
	@IsOptional()
	@IsDateString()
	estimatedPickUpDate?: string;

	@ApiProperty({ description: 'Hora estimada de recogida' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	estimatedPickUpTime?: string;

	@ApiProperty({ description: 'Observaciones' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255)
	observations?: string;

	@ApiProperty({ description: 'Recomendaciones' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255)
	recommendations?: string;

	@ApiProperty({ description: 'Transportadora asociada' })
	@IsOptional()
	@IsInt({ message: 'Debe de ser un número' })
	transporterId: number = null;
}

export class CollectionRequestRouteInfoDto {
	@ApiProperty({ description: 'Rutas', isArray: true, type: String })
	@IsArray({ message: 'Debe de ser un array' })
	routes: string[];
}

export class CollectionRequestQueryDto extends IntersectionType(
	PagerDto<CollectionRequestCreateDto>,
	PartialType(CollectionRequestCreateDto),
) { }


export class CollectionRequestRouteList {
	@ApiProperty({ description: 'idRuta' })
	idRuta: string;

	@ApiProperty({ description: 'idGuia' })
	idGuia: string;

	@ApiProperty({ description: 'tipo' })
	tipo: string;

	@ApiProperty({ description: 'secuencia' })
	secuencia: string;

	@ApiProperty({ description: 'fechaMov' })
	fechaMov: Date;

	@ApiProperty({ description: 'horaMov' })
	horaMov: string;

	@ApiProperty({ description: 'planeador' })
	planeador: number;

	@ApiProperty({ description: 'zona' })
	zona: string;

	@ApiProperty({ description: 'ciudad' })
	ciudad: string;

	@ApiProperty({ description: 'depto' })
	depto: string;

	@ApiProperty({ description: 'placa' })
	placa: string;

	@ApiProperty({ description: 'conductor' })
	conductor: string;

	@ApiProperty({ description: 'nombreSitio' })
	nombreSitio: string;

	@ApiProperty({ description: 'direccion' })
	direccion: string;

	@ApiProperty({ description: 'posGps' })
	posGps: string;

	@ApiProperty({ description: 'totCant' })
	totCant: number;

	@ApiProperty({ description: 'ocReferencia' })
	docReferencia: string;

	@ApiProperty({ description: 'docReferencia2' })
	docReferencia2: string;

	@ApiProperty({ description: 'urlSoportes' })
	urlSoportes: string;

	@ApiProperty({ description: 'detalles' })
	detalles: string;

}
