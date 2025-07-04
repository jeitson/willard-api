import { ApiProperty, IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
} from 'class-validator';

import { PagerDto } from 'src/core/common/dto/pager.dto';
import { HistoryJob } from '../entities/history_job.entity';

export class HistoryJobDto {
	@ApiProperty({ description: 'Llave', example: 'CRON::SYNC_CLIENT' })
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(25, { message: 'El tamaño máximo de caracteres es de 50' })
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	key: string;

	@ApiProperty({ description: 'Nombre'})
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(50, { message: 'El tamaño máximo de caracteres es de 50' })
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	name: string;

	@ApiProperty({ description: 'Descripción' })
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	description: string = '';

	@ApiProperty({ description: 'Contenido de Entrada', example: [] })
	@IsArray()
	inputContent: any = [];

	@ApiProperty({ description: 'Contenido de Salida', example: [] })
	@IsArray()
	outputContent: any = [];

	@ApiProperty({ description: 'Estado del Proceso' })
	@IsEnum(['SUCCESS', 'FAILED'], { message: 'Debe de ser un SUCCESS o FAILED' })
	statusProcess: 'SUCCESS' | 'FAILED' = 'SUCCESS';

	@IsOptional()
	creatorBy?: string;
}

export class HistoryJobQueryDto extends IntersectionType(
	PagerDto<HistoryJobDto>,
	PartialType(OmitType(HistoryJob, ['inputContent', 'outputContent', 'description', 'statusProcess'])),
) { }
