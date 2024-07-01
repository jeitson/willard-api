import { ApiProperty } from '@nestjs/swagger';

export class OnlineUserInfo {
	@ApiProperty({ description: 'Identificador único de sesión (tokenId)' })
	tokenId: string;

	@ApiProperty({ description: 'Nombre del departamento' })
	deptName: string;

	@ApiProperty({ description: 'ID de usuario' })
	uid: string;

	@ApiProperty({
		description: 'Indica si es el usuario que está actualmente autenticado',
	})
	isCurrent?: boolean;

	@ApiProperty({
		description:
			'Indica si no se permite desconectar a este usuario (por ejemplo, el usuario actual o un administrador)',
	})
	disable?: boolean;
}
