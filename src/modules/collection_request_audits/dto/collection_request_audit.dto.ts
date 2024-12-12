import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class CollectionRequestAuditCreateDto {
	@ApiProperty({ description: 'ID de la solicitud de recogida', example: 1 })
	@IsNotEmpty()
	@IsNumber()
	readonly collectionRequestId: number;

	@ApiProperty({ description: 'ID del estado de la solicitud', example: 1 })
	@IsNotEmpty()
	@IsNumber()
	readonly requestStatusId: number;

	@ApiProperty({ description: 'Nombre del estado', example: 'Estado inicial' })
	@IsNotEmpty()
	@IsString({ message: 'Debe de ser un texto' })
	readonly name: string;

	@ApiProperty({ description: 'Descripción adicional', example: 'Descripción detallada del estado' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	readonly description?: string;
}

export class CollectionRequestAuditUpdateDto {
	@ApiProperty({ description: 'Nombre del estado', example: 'Estado actualizado' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	readonly name?: string;

	@ApiProperty({ description: 'Descripción adicional', example: 'Descripción actualizada del estado' })
	@IsOptional()
	@IsString({ message: 'Debe de ser un texto' })
	readonly description?: string;
}
