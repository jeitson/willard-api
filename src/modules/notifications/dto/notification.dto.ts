import { ApiProperty, IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import {
	IsEmail,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	ValidateIf,
} from 'class-validator';
import { isEmpty } from 'lodash';
import { PagerDto } from 'src/core/common/dto/pager.dto';


export class NotificationDto {
	@ApiProperty({ description: 'Nombre', example: 'Nombre de la Plantilla...' })
	@IsString()
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	name: string = '';

	@ApiProperty({ description: 'Asunto', example: 'Asunto de la plantilla' })
	@IsString()
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	subject: string = '';

	@ApiProperty({ description: 'Plantilla', example: 'Contenido de la plantilla' })
	@IsString()
	@MaxLength(400, { message: 'El tamaño máximo de caracteres es de 400' })
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	template: string = '';

	@ApiProperty({ description: 'Correos', type: [String] })
	@IsString({ each: true })
	emails: string[] = [];
}

export class NotificationUpdateDto extends PartialType(NotificationDto) {}

export class NotificationQueryDto extends IntersectionType(
	PagerDto<NotificationDto>,
	PartialType(Notification),
) { }
