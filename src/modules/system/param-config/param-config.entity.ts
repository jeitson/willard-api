import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

import { CommonEntity } from 'src/core/common/entity/common.entity';

@Entity({ name: 'sys_config' })
export class ParamConfigEntity extends CommonEntity {
	@Column({ type: 'varchar', length: 50 })
	@ApiProperty({ description: 'Nombre de la configuración' })
	name: string;

	@Column({ type: 'varchar', length: 50, unique: true })
	@ApiProperty({ description: 'Clave de la configuración' })
	key: string;

	@Column({ type: 'varchar', nullable: true })
	@ApiProperty({ description: 'Valor de la configuración' })
	value: string;

	@Column({ type: 'varchar', nullable: true })
	@ApiProperty({ description: 'Descripción de la configuración' })
	remark: string;
}
