import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsEmail,
	IsInt,
	IsMobilePhone,
	IsOptional,
	IsString,
} from 'class-validator';

// DTO para la configuración del captcha de imagen
export class ImageCaptchaDto {
	@ApiProperty({
		required: false,
		default: 100,
		description: 'Ancho del captcha',
	})
	@Type(() => Number)
	@IsInt()
	@IsOptional()
	readonly width: number = 100;

	@ApiProperty({
		required: false,
		default: 50,
		description: 'Alto del captcha',
	})
	@Type(() => Number)
	@IsInt()
	@IsOptional()
	readonly height: number = 50;
}

// DTO para enviar código de verificación por correo electrónico
export class SendEmailCodeDto {
	@ApiProperty({ description: 'Correo electrónico' })
	@IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
	email: string;
}

// DTO para enviar código de verificación por SMS
export class SendSmsCodeDto {
	@ApiProperty({ description: 'Número de teléfono' })
	@IsMobilePhone(
		'zh-CN',
		{},
		{ message: 'El formato del número de teléfono no es válido' },
	)
	phone: string;
}

// DTO para verificar el código de verificación
export class CheckCodeDto {
	@ApiProperty({ description: 'Número de teléfono/correo electrónico' })
	@IsString()
	account: string;

	@ApiProperty({ description: 'Código de verificación' })
	@IsString()
	code: string;
}
