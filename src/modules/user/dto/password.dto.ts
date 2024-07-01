import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class PasswordUpdateDto {
	@ApiProperty({ description: 'Contraseña antigua' })
	@IsString()
	@Matches(/^[a-z0-9A-Z\W_]+$/)
	@MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
	@MaxLength(20, {
		message: 'La contraseña no debe tener más de 20 caracteres',
	})
	oldPassword: string;

	@ApiProperty({ description: 'Nueva contraseña' })
	@Matches(/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Za-z])\S*$/, {
		message:
			'La contraseña debe contener al menos una letra y un número, y tener entre 6 y 16 caracteres',
	})
	newPassword: string;
}

export class UserPasswordDto {
	@ApiProperty({ description: 'Contraseña nueva' })
	@Matches(/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Za-z])\S*$/, {
		message:
			'La contraseña debe contener al menos una letra y un número, y tener entre 6 y 16 caracteres',
	})
	password: string;
}

export class UserExistDto {
	@ApiProperty({ description: 'Nombre de usuario' })
	@IsString()
	@Matches(/^[a-zA-Z0-9_-]{4,16}$/, {
		message:
			'El nombre de usuario debe contener solo letras, números, guiones bajos y guiones, y tener entre 4 y 16 caracteres',
	})
	@MinLength(6, {
		message: 'El nombre de usuario debe tener al menos 6 caracteres',
	})
	@MaxLength(20, {
		message: 'El nombre de usuario no debe tener más de 20 caracteres',
	})
	username: string;
}
