import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class NotesCreditQueryDto {
	@ApiProperty({ description: 'ID de la transportadora' })
	@IsInt({ message: 'El ID de la transportadora debe ser un número entero.' })
	transporterId: number;
}
