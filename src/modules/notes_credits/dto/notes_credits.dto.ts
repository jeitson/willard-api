import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class NotesCreditQueryDto {
	@ApiProperty({ description: 'ID de la transportadora' })
	@IsInt({ message: 'El ID de la transportadora debe ser un número entero.' })
	transporterId: number;
}

// export class NotesCreditUpdateStatusDto extends NotesCreditQueryDto {
// 	@ApiProperty({ description: 'Número de Guía' })
// 	@IsString({ message: 'El Número de Guía debe ser un número entero.' })
// 	guideId: string;
// }

export class NotesCreditDetailResponseDto {
	@ApiProperty({ description: 'Nombre del producto' })
	name: string

	@ApiProperty({ description: 'Cantidad' })
	quantity: string
}

export class NotesCreditResponseDto {
	@ApiProperty({ description: 'ID de la auditoria ruta' })
	auditRouteId: string;

	@ApiProperty({ description: 'ID de la transportadora' })
	transporterId: string;

	@ApiProperty({ description: 'Nombre de la transportadora' })
	transporter: string;

	@ApiProperty({ description: 'Número de guía' })
	guide: string;

	@ApiProperty({ description: 'Factura' })
	invoice: string;

	@ApiProperty({ description: 'Baterías pendientes', type: [NotesCreditDetailResponseDto] })
	batteries_pending: NotesCreditDetailResponseDto[];
}
