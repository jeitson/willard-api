import { ApiProperty, IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import {
	IsArray,
	IsNotEmpty,
	IsString,
	MaxLength,
} from 'class-validator';

import { PagerDto } from 'src/core/common/dto/pager.dto';
import { HistoryJob } from '../entities/history_job.entity';

export class HistoryJobDto {
	@ApiProperty({ description: 'Llave', example: 'CRON::SYNC_CLIENT' })
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(50, { message: 'El tamaño máximo de caracteres es de 50' })
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	key: string;

	@ApiProperty({ description: 'Nombre', example: 'Administrador' })
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(50, { message: 'El tamaño máximo de caracteres es de 50' })
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	name: string;

	@ApiProperty({ description: 'Descripción', example: 'Rol aplicado a los usuarios administrativos' })
	@IsString({ message: 'Debe de ser un texto' })
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	description: string = '';

	@ApiProperty({ description: 'Contenido de Entrada', example: [] })
	@IsArray()
	inputContent: any = [];

	@ApiProperty({ description: 'Contenido de Salida', example: [] })
	@IsArray()
	outputContent: any = [];
}

export class HistoryJobQueryDto extends IntersectionType(
	PagerDto<HistoryJobDto>,
	PartialType(OmitType(HistoryJob, ['inputContent', 'outputContent', 'description'])),
) { }
