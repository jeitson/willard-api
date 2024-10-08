import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
} from 'class-validator';
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
  @IsEmail({}, { each: true, message: 'Cada dirección de correo debe ser válida' })
  emails: string[] = [];
}


export class NotificationSendDto {
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

	@ApiProperty({ description: 'Cuerpo', example: 'Contenido de la plantilla' })
	@IsString()
	@MaxLength(400, { message: 'El tamaño máximo de caracteres es de 400' })
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	body: string = '';

	@ApiProperty({ description: 'Destinatario', type: [String] })
  	@IsEmail({}, { each: true, message: 'Cada dirección de correo debe ser válida' })
	addressee: string[] = [];
}

export class NotificationUpdateDto extends PartialType(NotificationDto) {}

export class NotificationQueryDto extends IntersectionType(
	PagerDto<NotificationDto>,
	PartialType(NotificationDto),
) { }
