import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

import { PagerDto } from 'src/core/common/dto/pager.dto';

export class ParamConfigDto {
	@ApiProperty({ description: 'Nombre del parámetro' })
	@IsString()
	name: string;

	@ApiProperty({ description: 'Clave del parámetro' })
	@IsString()
	@MinLength(3, {
		message: 'La longitud mínima de la clave debe ser 3 caracteres',
	})
	key: string;

	@ApiProperty({ description: 'Valor del parámetro' })
	@IsString()
	value: string;

	@ApiProperty({
		description: 'Observaciones o notas adicionales (opcional)',
	})
	@IsOptional()
	@IsString()
	remark?: string;
}

export class ParamConfigQueryDto extends PagerDto<ParamConfigQueryDto> {
	@ApiProperty({
		description: 'Nombre del parámetro para filtrar (opcional)',
	})
	@IsString()
	@IsOptional()
	name: string;
}
