import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import {
	IsEmail,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';

import { MenuEntity } from 'src/modules/system/menu/menu.entity';

// DTO para actualizar la cuenta de usuario
export class AccountUpdateDto {
	@ApiProperty({ description: 'Nombre de usuario', required: false })
	@IsString()
	@IsOptional()
	nickname: string;

	@ApiProperty({ description: 'Correo electrónico del usuario' })
	@IsEmail()
	email: string;

	@ApiProperty({ description: 'Número de QQ del usuario', required: false })
	@IsOptional()
	@IsString()
	@Matches(/^[0-9]+$/)
	@MinLength(5)
	@MaxLength(11)
	qq: string;

	@ApiProperty({
		description: 'Número de teléfono del usuario',
		required: false,
	})
	@IsOptional()
	@IsString()
	phone: string;

	@ApiProperty({
		description: 'URL de la imagen de perfil del usuario',
		required: false,
	})
	@IsOptional()
	@IsString()
	avatar: string;

	@ApiProperty({
		description: 'Nota o comentario sobre el usuario',
		required: false,
	})
	@IsOptional()
	@IsString()
	remark: string;
}

// DTO para restablecer la contraseña del usuario
export class ResetPasswordDto {
	@ApiProperty({ description: 'Token temporal', example: 'uuid' })
	@IsString()
	accessToken: string;

	@ApiProperty({ description: 'Nueva contraseña', example: 'a123456' })
	@IsString()
	@Matches(/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Za-z])\S*$/)
	@MinLength(6)
	password: string;
}

// DTO para metadatos de menú (utilizado en la API de cuentas)
export class MenuMeta extends PartialType(
	OmitType(MenuEntity, [
		'parentId',
		'createdAt',
		'updatedAt',
		'id',
		'roles',
		'path',
		'name',
	] as const),
) {
	@ApiProperty({ description: 'Título del menú', required: true })
	title: string;
}

// DTO para detalles de menú en la cuenta de usuario
export class AccountMenus extends PickType(MenuEntity, [
	'id',
	'path',
	'name',
	'component',
] as const) {
	@ApiProperty({ description: 'Metadatos del menú', type: MenuMeta })
	meta: MenuMeta;
}
