import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AuthPHCentralDto {
	@ApiProperty({ description: 'Nombre de Usuario' })
	@IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
	@IsString({ message: 'El nombre de usuario debe de ser un texto' })
	userName: string;

	@ApiProperty({ description: 'Contraseña' })
	@IsNotEmpty({ message: 'La contraseña es obligatoria' })
	@IsString({ message: 'La contraseña debe de ser un texto' })
	password: string;
}
