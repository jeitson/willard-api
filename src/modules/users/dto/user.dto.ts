import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import {
	IsEmail,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
	ValidateIf,
} from 'class-validator';
import { isEmpty } from 'lodash';
import { PagerDto } from 'src/core/common/dto/pager.dto';


export class UserDto {
	@ApiProperty({ description: 'OauthId', example: '123...' })
	@IsOptional()
	@IsInt()
	OauthId?: string;

	@ApiProperty({ description: 'Nombre', example: 'Jon Doe' })
	@IsString()
	@MaxLength(50, { message: 'El tamaño máximo de caracteres es de 50' })
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	Nombre: string;


	@ApiProperty({ description: 'Descripción', example: 'Jon Doe, usuario de prueba' })
	@IsString()
	@MaxLength(255, { message: 'El tamaño máximo de caracteres es de 255' })
	Descripcion: string = '';


	@ApiProperty({ description: 'Email', example: 'bqy.dev@qq.com' })
	@IsEmail()
	@ValidateIf((o) => !isEmpty(o.email))
	Email: string;
}

export class UserUpdateDto extends PartialType(UserDto) { }

export class UserQueryDto extends IntersectionType(
	PagerDto<UserDto>,
	PartialType(UserDto),
) { }
