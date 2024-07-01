import { ApiProperty } from '@nestjs/swagger';

export class AccountInfo {
	@ApiProperty({ description: 'ID de usuario' })
	username: string;

	@ApiProperty({ description: 'Nombre de usuario' })
	nickname: string;

	@ApiProperty({ description: 'Correo' })
	email: string;

	@ApiProperty({ description: 'Celular' })
	phone: string;

	@ApiProperty({ description: 'Nota' })
	remark: string;

	@ApiProperty({ description: 'Avatar' })
	avatar: string;
}
