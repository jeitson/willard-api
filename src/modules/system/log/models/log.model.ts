import { ApiProperty } from '@nestjs/swagger';

export class LoginLogInfo {
	@ApiProperty({
		description:
			'Número de identificación del registro de inicio de sesión',
	})
	id: string;

	@ApiProperty({
		description: 'Dirección IP de inicio de sesión',
		example: '1.1.1.1',
	})
	ip: string;

	@ApiProperty({ description: 'Dirección de inicio de sesión' })
	address: string;

	@ApiProperty({ description: 'Sistema operativo', example: 'Windows 10' })
	os: string;

	@ApiProperty({ description: 'Navegador web', example: 'Chrome' })
	browser: string;

	@ApiProperty({
		description: 'Nombre de usuario de inicio de sesión',
		example: 'admin',
	})
	username: string;

	@ApiProperty({
		description: 'Fecha y hora de inicio de sesión',
		example: '2023-12-22 16:46:20.333843',
	})
	time: string;
}

export class TaskLogInfo {
	@ApiProperty({
		description: 'Número de identificación del registro de tarea',
	})
	id: string;

	@ApiProperty({ description: 'Número de identificación de la tarea' })
	taskId: number;

	@ApiProperty({ description: 'Nombre de la tarea' })
	name: string;

	@ApiProperty({ description: 'Fecha de creación del registro' })
	createdAt: string;

	@ApiProperty({
		description: 'Tiempo de ejecución de la tarea en milisegundos',
	})
	consumeTime: number;

	@ApiProperty({ description: 'Detalles de la ejecución de la tarea' })
	detail: string;

	@ApiProperty({ description: 'Estado de ejecución de la tarea' })
	status: number;
}
