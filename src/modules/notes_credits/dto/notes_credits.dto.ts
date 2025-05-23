import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class NotesCreditQueryDto {
	@ApiProperty({ description: 'ID de la transportadora' })
	@IsInt({ message: 'El ID de la transportadora debe ser un número entero.' })
	transporterId: number;
}

export class NotesCreditDetailResponseDto {
	@ApiProperty({ description: 'Nombre del producto' })
	name: string

	@ApiProperty({ description: 'Cantidad' })
	quantity: string
}

export class NotesCreditResponseDto {
	@ApiProperty({ description: 'ID de la transportadora' })
	transporter: string;

	@ApiProperty({ description: 'ID de la guía' })
	guide: string;

	@ApiProperty({ description: 'ID de la factura' })
	invoice: string;

	@ApiProperty({ description: 'Baterías pendientes', type: [NotesCreditDetailResponseDto] })
	baterias_pendiente: NotesCreditDetailResponseDto[];
}
