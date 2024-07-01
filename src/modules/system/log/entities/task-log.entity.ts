import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

import { CommonEntity } from 'src/core/common/entity/common.entity';

@Entity({ name: 'sys_task_log' })
export class TaskLogEntity extends CommonEntity {
	@Column({ type: 'boolean', default: 0 })
	@ApiProperty({ description: 'Estado de la tarea: 0 = Fallida, 1 = Exitosa' })
	status: boolean;

	@Column({ type: 'text', nullable: true })
	@ApiProperty({ description: 'Información detallada de la tarea' })
	detail: string;

	@Column({ type: 'int', nullable: true, name: 'consume_time', default: 0 })
	@ApiProperty({ description: 'Tiempo de ejecución de la tarea' })
	consumeTime: number;
}
