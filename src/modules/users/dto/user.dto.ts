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

	@ApiProperty({ description: 'Roles', type: [Number] })
	@IsInt({ each: true })
	@IsOptional()
	roles: number[] = [];
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
}

export class UserUpdateDto extends PartialType(UserDto) {}

export class UserQueryDto extends IntersectionType(
	PagerDto<UserDto>,
	PartialType(OmitType(UserDto, ['description', 'oauthId']), { skipNullProperties: false }),
) { }
