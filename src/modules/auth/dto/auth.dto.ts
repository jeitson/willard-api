import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

// DTO para el inicio de sesión
export class LoginDto {
	@ApiProperty({
		description: 'Número de teléfono/correo electrónico',
		example: 'usuario@example.com',
	})
	@IsString()
	@MinLength(4, {
		message: 'El correo debe tener al menos 4 caracteres',
	})
	email: string;

	@ApiProperty({ description: 'Contraseña', example: 'a123456' })
	@IsString()
	@Matches(/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Za-z])\S*$/, {
		message:
			'La contraseña debe tener al menos 6 caracteres y contener al menos un número y una letra',
	})
	password: string;

	@ApiProperty({ description: 'Identificador de captcha', example: '123456' })
	@IsString()
	captchaId: string;

	@ApiProperty({
		description: 'Código de verificación ingresado por el usuario',
		example: '1234',
	})
	@IsString()
	@MinLength(4, {
		message:
			'El código de verificación debe tener exactamente 4 caracteres',
	})
	@MaxLength(4, {
		message:
			'El código de verificación debe tener exactamente 4 caracteres',
	})
	verifyCode: string;
}

// DTO para el registro de usuarios
export class RegisterDto {
	@ApiProperty({ description: 'Correo electronico', example: 'usuario123' })
	@IsString()
	username: string;

	@ApiProperty({ description: 'Correo electronico', example: 'usuario123' })
	@IsString()
	@MinLength(4, {
		message: 'El correo debe tener al menos 4 caracteres',
	})
	email: string;

	@ApiProperty({ description: 'Contraseña', example: 'a123456' })
	@IsString()
	@Matches(/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Za-z])\S*$/, {
		message:
			'La contraseña debe tener entre 6 y 16 caracteres y contener al menos un número y una letra',
	})
	@MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
	@MaxLength(16, {
		message: 'La contraseña debe tener como máximo 16 caracteres',
	})
	password: string;

	@ApiProperty({ description: 'Idioma', examples: ['EN', 'ZH'] })
	@IsString()
	lang: string;
}
