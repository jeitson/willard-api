import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	ArrayMaxSize,
	ArrayMinSize,
	ArrayNotEmpty,
	IsEmail,
	IsIn,
	IsInt,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength,
	ValidateIf,
} from 'class-validator';
import { isEmpty } from 'lodash';

import { PagerDto } from 'src/core/common/dto/pager.dto';

export class UserDto {
	@ApiProperty({ description: 'Avatar' })
	@IsOptional()
	@IsString()
	avatar?: string;

	@ApiProperty({ description: 'Username', example: 'admin' })
	@IsString()
	@Matches(/^[a-z0-9A-Z\W_]+$/)
	@MinLength(4, { message: 'Username must be at least 4 characters' })
	@MaxLength(20, { message: 'Username cannot exceed 20 characters' })
	username: string;

	@ApiProperty({ description: 'Password', example: 'a123456' })
	@IsOptional()
	@Matches(/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Za-z])\S*$/, {
		message:
			'Password must contain at least one letter and one number, with length between 6 and 16',
	})
	password: string;

	@ApiProperty({ description: 'Roles', type: [String] })
	@ArrayNotEmpty()
	@ArrayMinSize(1)
	@ArrayMaxSize(3)
	roleIds: string[];

	@ApiProperty({ description: 'Department ID', type: String })
	@Type(() => String)
	@IsInt()
	@IsOptional()
	deptId?: string;

	@ApiProperty({ description: 'Nickname', example: 'admin' })
	@IsOptional()
	@IsString()
	nickname: string;

	@ApiProperty({ description: 'Email', example: 'bqy.dev@qq.com' })
	@IsEmail()
	@ValidateIf((o) => !isEmpty(o.email))
	email: string;

	@ApiProperty({ description: 'Phone number' })
	@IsOptional()
	@IsString()
	phone?: string;

	@ApiProperty({ description: 'Remark' })
	@IsOptional()
	@IsString()
	remark?: string;

	@ApiProperty({ description: 'Status' })
	@IsIn([0, 1])
	status: boolean;
}

export class UserUpdateDto extends PartialType(UserDto) {}

export class UserQueryDto extends IntersectionType(
	PagerDto<UserDto>,
	PartialType(UserDto),
) {
	@ApiProperty({ description: 'Department ID', example: 1, required: false })
	@IsInt()
	@IsOptional()
	deptId?: string;

	@ApiProperty({ description: 'Status', example: 0, required: false })
	@IsInt()
	@IsOptional()
	status?: boolean;
}
