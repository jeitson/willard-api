import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
	IsBoolean,
	IsIn,
	IsInt,
	IsOptional,
	IsString,
	Min,
	MinLength,
	ValidateIf,
} from 'class-validator';

export class MenuDto {
	@ApiProperty({ description: 'Tipo de menú' })
	@IsIn([0, 1, 2])
	type: number;

	@ApiProperty({ description: 'Menú padre' })
	@IsOptional()
	parentId: string;

	@ApiProperty({ description: 'Nombre del menú o permiso' })
	@IsString()
	@MinLength(2)
	name: string;

	@ApiProperty({ description: 'Orden' })
	@IsInt()
	@Min(0)
	orderNo: number;

	@ApiProperty({ description: 'Ruta de enrutamiento del frontend' })
	// @Matches(/^[/]$/)
	@ValidateIf((o) => o.type !== 2)
	path: string;

	@ApiProperty({ description: '¿Es un enlace externo?', default: false })
	@ValidateIf((o) => o.type !== 2)
	@IsBoolean()
	isExt: boolean;

	@ApiProperty({
		description: 'Modo de apertura para enlaces externos',
		default: 1,
	})
	@ValidateIf((o: MenuDto) => o.isExt)
	@IsBoolean()
	extOpenMode: boolean;

	@ApiProperty({ description: '¿Mostrar el menú?', default: 1 })
	@ValidateIf((o: MenuDto) => o.type !== 2)
	@IsBoolean()
	show: boolean;

	@ApiProperty({
		description: 'Identificador del menú activo',
		required: false,
	})
	@ValidateIf((o: MenuDto) => o.type !== 2 && o.show)
	@IsString()
	@IsOptional()
	activeMenu?: string;

	@ApiProperty({ description: '¿Activar la caché de la página?', default: 1 })
	@ValidateIf((o: MenuDto) => o.type === 1)
	@IsBoolean()
	keepAlive: boolean;

	@ApiProperty({ description: 'Estado', default: true })
	@IsBoolean()
	status: boolean;

	@ApiProperty({ description: 'Icono del menú', required: false })
	@IsOptional()
	@ValidateIf((o: MenuDto) => o.type !== 2)
	@IsString()
	icon?: string;

	@ApiProperty({ description: 'Permiso asociado (solo para tipo 2)' })
	@ValidateIf((o: MenuDto) => o.type === 2)
	@IsString()
	@IsOptional()
	permission: string;

	@ApiProperty({
		description: 'Ruta de enrutamiento del menú o enlace externo',
		required: false,
	})
	@ValidateIf((o: MenuDto) => o.type !== 2)
	@IsString()
	@IsOptional()
	component?: string;
}

export class MenuUpdateDto extends PartialType(MenuDto) {}

export class MenuQueryDto extends PartialType(MenuDto) {}
