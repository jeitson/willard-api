import { ApiProperty, IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	ArrayNotEmpty,
	IsArray,
	IsEmail,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength,
	ValidateIf,
	ValidateNested,
} from 'class-validator';
import { isEmpty } from 'lodash';
import { PagerDto } from 'src/core/common/dto/pager.dto';


export class UserDto {
	@ApiProperty({ description: 'OauthId', example: '123...' })
	@IsOptional()
	@IsString()
	oauthId?: string;

	@ApiProperty({ description: 'Nombre', example: 'Jon Doe' })
	@IsOptional()
	@IsString()
	@MaxLength(50, { message: 'El tamaño máximo de caracteres es de 50' })
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	name: string = null;

	@ApiProperty({ description: 'Descripción', example: 'Jon Doe, usuario de prueba' })
	@IsString()
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	description: string = '';

	@ApiProperty({ description: 'Celular' })
	@IsString()
	@MaxLength(10, { message: 'El tamaño máximo de caracteres es de 10' })
	cellphone: string = '';

	@ApiProperty({ description: 'Email', example: 'bqy.dev@qq.com' })
	@IsEmail()
	@ValidateIf((o) => !isEmpty(o.email))
	email: string;

	@ApiProperty({ description: 'Contraseña' })
	@IsOptional()
	@IsString()
	password?: string;

	@ApiProperty({ description: 'Referencia WLL del usuario, debe ser un texto.' })
	@IsOptional()
	@IsString({ message: 'ReferenciaWLL debe ser un texto.' })
	referenceWLL: string;

	@ApiProperty({ description: 'Referencia PH del usuario, debe ser un texto.' })
	@IsOptional()
	@IsString({ message: 'ReferenciaPH debe ser un texto.' })
	referencePH: string;

	@ApiProperty({ description: 'Roles', type: [Number] })
	@IsInt({ each: true })
	@IsOptional()
	roles?: number[] = [];

	@ApiProperty({ description: 'Sedes de Acopio', type: [Number] })
	@IsInt({ each: true })
	@IsOptional()
	collectionSites?: number[] = [];

	@ApiProperty({ description: 'Zonas', type: [Number] })
	@IsInt({ each: true })
	@IsOptional()
	zones?: number[] = [];
}

export class UserOAuthDto {
	@ApiProperty({ description: 'OauthId' })
	@IsOptional()
	@IsString()
	user_id?: string;

	@ApiProperty({ description: 'Nombre' })
	@IsOptional()
	@IsString()
	@MaxLength(50, { message: 'El tamaño máximo de caracteres es de 50' })
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	name: string = null;

	@ApiProperty({ description: 'Email' })
	@IsEmail()
	@ValidateIf((o) => !isEmpty(o.email))
	email: string;

	@ApiProperty({ description: 'Celular' })
	@IsString()
	@MaxLength(10, { message: 'El tamaño máximo de caracteres es de 10' })
	cellphone: string = '';
}

export class UserUpdateDto extends PartialType(UserDto) { }

export class PasswordUpdateDto {
	@ApiProperty({
		description: 'Contraseña',
		minLength: 8,
		maxLength: 20,
		example: 'Password123!'
	})
	@IsString({ message: 'La contraseña debe ser una cadena de texto.' })
	@MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
	@MaxLength(20, { message: 'La contraseña no puede tener más de 20 caracteres.' })
	@Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
		message: 'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial.'
	})
	password: string;
}

export class UserQueryDto extends IntersectionType(
	PagerDto<UserDto>,
	PartialType(PickType(UserDto, ['name', 'email', 'oauthId']), { skipNullProperties: false }),
) { }

export class UserSearchByRoleDto {
	@ApiProperty({ type: [Number], description: 'Consulta usuarios por varios roles' })
	@IsArray({ message: 'El campo "roles" debe ser un arreglo de id\'s' })
	// @ArrayNotEmpty({ message: 'El arreglo de roles no puede estar vacío' })
	@IsNumber({}, { each: true, message: 'Cada elemento en "roles" debe ser un número' })
	roles: number[];

	@ApiProperty({ type: [Number], description: 'Consulta usuarios por varias sedes de acopio' })
	@IsArray({ message: 'El campo "sedes de acopio" debe ser un arreglo de id\'s' })
	// @ArrayNotEmpty({ message: 'El arreglo de sedes de acopios no puede estar vacío' })
	@IsNumber({}, { each: true, message: 'Cada elemento en "collectionSites" debe ser un número' })
	collectionSites: number[];

	@ApiProperty({ type: [Number], description: 'Consulta usuarios por varias zonas' })
	@IsArray({ message: 'El campo "zonas" debe ser un arreglo de id\'s' })
	// @ArrayNotEmpty({ message: 'El arreglo de sedes de acopios no puede estar vacío' })
	@IsNumber({}, { each: true, message: 'Cada elemento en "zonas" debe ser un número' })
	zones: number[];
}
