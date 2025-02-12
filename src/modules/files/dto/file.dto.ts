import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GetFile {
	@ApiProperty({ description: 'Arhcivo a consultar' })
	@IsString({ each: true, message: 'La URL es obligatoria' })
	url: string;
}
