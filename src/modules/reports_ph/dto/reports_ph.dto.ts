// DTOs para Reporte
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { PagerDto } from 'src/core/common/dto/pager.dto';

export class ReportCreateDto {
	@ApiProperty({ description: 'Número de guía del reporte.' })
	@IsNotEmpty({ message: 'NumeroGuia es obligatorio.' })
	@IsString({ message: 'NumeroGuia debe ser un texto.' })
	guideNumber: string;

	@ApiProperty({ description: 'ID del cliente asociado al reporte.' })
	@IsNotEmpty({ message: 'ClienteId es obligatorio.' })
	@IsNumber({}, { message: 'ClienteId debe ser un número.' })
	clientId: number;

	@ApiProperty({ description: 'ID del producto asociado al reporte.' })
	@IsNotEmpty({ message: 'ProductoId es obligatorio.' })
	@IsNumber({}, { message: 'ProductoId debe ser un número.' })
	productId: number;

	@ApiProperty({ description: 'ID de la sede de acopio asociada al reporte.' })
	@IsNotEmpty({ message: 'SedeAcopioId es obligatorio.' })
	@IsNumber({}, { message: 'SedeAcopioId debe ser un número.' })
	collectionSiteId: number;
}
export class FindByAgencyDto {
    @ApiProperty({ description: 'Lista de referencias PH de la agencia.', type: [String] })
    @IsNotEmpty({ message: 'El campo referenciasPh no puede estar vacío.' })
    @IsString({ each: true, message: 'Cada referencia PH debe ser un texto.' })
    referenciasPh: string[];
}

export class ReportUpdateDto extends PartialType(ReportCreateDto) { }

export class ReportQueryDto extends IntersectionType(
	PagerDto<ReportCreateDto>,
	PartialType(PickType(ReportCreateDto, ['guideNumber', 'clientId', 'productId', 'collectionSiteId'])),
) { }
