import { ApiProperty, IntersectionType, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, IsNumber, MaxLength } from "class-validator";
import { PagerDto } from "src/core/common/dto/pager.dto";

export class CollectionRequestCreateDto {
	@ApiProperty({ description: 'Cliente asociado' })
	@IsInt()
	clientId: number;

	@ApiProperty({ description: 'Lugar de recogida asociado' })
	@IsInt()
	pickUpLocationId: number;

	@ApiProperty({ description: 'Sede de Acopio asociada' })
	@IsInt()
	collectionSiteId: number;

	@ApiProperty({ description: 'Transportadora asociada' })
	@IsInt()
	transportadoraId: number;

	@ApiProperty({ description: 'Asesor asociado' })
	@IsInt()
	consultantId: number;

	@ApiProperty({ description: 'Nombre' })
	@IsString()
	@MaxLength(50)
	name: string;

	@ApiProperty({ description: 'Descripción' })
	@IsOptional()
	@IsString()
	@MaxLength(255)
	description?: string;

	@ApiProperty({ description: 'Fecha de solicitud' })
	@IsDateString()
	requestDate: string;

	@ApiProperty({ description: 'Hora de solicitud' })
	@IsString()
	requestTime: string;

	@ApiProperty({ description: 'Cantidad estimada' })
	@IsNumber()
	estimatedQuantity: number;

	@ApiProperty({ description: 'KG estimados' })
	@IsNumber()
	estimatedKG: number;

	@ApiProperty({ description: 'Es especial' })
	@IsBoolean()
	isSpecial: boolean;

	@ApiProperty({ description: 'Estado de la solicitud' })
	@IsInt()
	requestStatusId: number;

	@ApiProperty({ description: 'Fecha estimada de recogida' })
	@IsOptional()
	@IsDateString()
	estimatedPickUpDate?: string;

	@ApiProperty({ description: 'Hora estimada de recogida' })
	@IsOptional()
	@IsString()
	estimatedPickUpTime?: string;

	@ApiProperty({ description: 'Observaciones' })
	@IsOptional()
	@IsString()
	@MaxLength(255)
	observations?: string;

	@ApiProperty({ description: 'Recomendaciones' })
	@IsOptional()
	@IsString()
	@MaxLength(255)
	recommendations?: string;
}

export class CollectionRequestUpdateDto extends CollectionRequestCreateDto { }

export class CollectionRequestQueryDto extends IntersectionType(
	PagerDto<CollectionRequestCreateDto>,
	PartialType(CollectionRequestCreateDto),
) { }
