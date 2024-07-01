import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PagerDto } from 'src/core/common/dto/pager.dto';

export class LoginLogQueryDto extends PagerDto<LoginLogQueryDto> {
	@ApiProperty({ description: 'Nombre de usuario' })
	@IsString()
	@IsOptional()
	username: string;

	@ApiProperty({ description: 'IP de inicio de sesión' })
	@IsOptional()
	@IsString()
	ip?: string;

	@ApiProperty({ description: 'Ubicación de inicio de sesión' })
	@IsOptional()
	@IsString()
	address?: string;

	@ApiProperty({ description: 'Fecha y hora de inicio de sesión' })
	@IsOptional()
	time?: string[];
}

export class TaskLogQueryDto extends PagerDto<TaskLogQueryDto> {
	@ApiProperty({ description: 'Nombre de usuario' })
	@IsOptional()
	@IsString()
	username: string;

	@ApiProperty({ description: 'IP de inicio de sesión' })
	@IsString()
	@IsOptional()
	ip?: string;

	@ApiProperty({ description: 'Fecha y hora de inicio de la tarea' })
	@IsOptional()
	time?: string[];
}

export class CaptchaLogQueryDto extends PagerDto<CaptchaLogQueryDto> {
	@ApiProperty({ description: 'Nombre de usuario' })
	@IsOptional()
	@IsString()
	username: string;

	@ApiProperty({ description: 'Código de captcha' })
	@IsString()
	@IsOptional()
	code?: string;

	@ApiProperty({ description: 'Fecha y hora de envío del captcha' })
	@IsOptional()
	time?: string[];
}
