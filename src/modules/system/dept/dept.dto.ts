import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	ArrayNotEmpty,
	IsArray,
	IsInt,
	IsOptional,
	IsString,
	Min,
	MinLength,
	ValidateNested,
} from 'class-validator';

export class DeptDto {
	@ApiProperty({ description: 'Nombre del departamento' })
	@IsString()
	@MinLength(1)
	name: string;

	@ApiProperty({ description: 'ID del departamento padre', required: false })
	@Type(() => Number)
	@IsInt()
	@IsOptional()
	parentId: number;

	@ApiProperty({
		description: 'Número de orden para clasificación',
		required: false,
	})
	@IsInt()
	@Min(0)
	@IsOptional()
	orderNo: number;
}

export class TransferDeptDto {
	@ApiProperty({
		description: 'Lista de IDs de administradores a transferir',
		type: [Number],
	})
	@IsArray()
	@ArrayNotEmpty()
	userIds: number[];

	@ApiProperty({
		description: 'ID del departamento de destino para la transferencia',
	})
	@IsInt()
	@Min(0)
	deptId: number;
}

export class MoveDept {
	@ApiProperty({ description: 'ID del departamento actual' })
	@IsInt()
	@Min(0)
	id: string;

	@ApiProperty({
		description: 'ID del departamento padre al que se va a mover',
		required: false,
	})
	@IsInt()
	@Min(0)
	@IsOptional()
	parentId: number;
}

export class MoveDeptDto {
	@ApiProperty({
		description: 'Lista de departamentos a mover',
		type: [MoveDept],
	})
	@ValidateNested({ each: true })
	@Type(() => MoveDept)
	depts: MoveDept[];
}

export class DeptQueryDto {
	@ApiProperty({ description: 'Nombre del departamento' })
	@IsString()
	@IsOptional()
	name?: string;
}
