import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

import { CommonEntity } from 'src/core/common/entity/common.entity';

@Entity({ name: 'sys_captcha_log' })
export class CaptchaLogEntity extends CommonEntity {
	@Column({ name: 'user_id', nullable: true })
	@ApiProperty({ description: 'ID del usuario' })
	userId: number;

	@Column({ nullable: true })
	@ApiProperty({ description: 'Cuenta' })
	account: string;

	@Column({ nullable: true })
	@ApiProperty({ description: 'Código de verificación' })
	code: string;

	@Column({ nullable: true })
	@ApiProperty({ description: 'Proveedor de código de verificación' })
	provider: 'sms' | 'email';
}
