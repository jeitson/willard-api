import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { CompleteEntity } from 'src/core/common/entity/common.entity';

@Entity('usuario_zona')
export class UserZone extends CompleteEntity {
	@PrimaryColumn({ type: 'bigint', name: 'UsuarioId' })
	userId: string;

	@PrimaryColumn({ type: 'bigint', name: 'ZonaId' })
	zoneId: number;

	@ManyToOne(() => User, user => user.zones)
	@JoinColumn({ name: 'UsuarioId' })
	user: User;
}
