import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class StatusDto {
	@ApiProperty({ description: 'Estado' })
	@IsBoolean()
	@IsNotEmpty({ message: 'El campo no debe de estar vacío' })
	status: boolean = false;
}
