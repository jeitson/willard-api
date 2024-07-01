import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CommonEntity } from 'src/core/common/entity/common.entity';

import { UserEntity } from '../../../user/user.entity';

@Entity({ name: 'sys_login_log' })
export class LoginLogEntity extends CommonEntity {
	@Column({ nullable: true })
	@ApiProperty({ description: 'IP' })
	ip: string;

	@Column({ nullable: true })
	@ApiProperty({ description: 'Dirección' })
	address: string;

	@Column({ nullable: true })
	@ApiProperty({ description: 'Proveedor de inicio de sesión' })
	provider: string;

	@Column({ length: 500, nullable: true })
	@ApiProperty({ description: 'Agente de usuario del navegador (UA)' })
	ua: string;

	@ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: UserEntity;
}
