import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Role } from 'src/modules/roles/entities/rol.entity';

@Entity('usuario_rol')
export class UserRole {
	@PrimaryColumn({ type: 'bigint', name: 'UsuarioId' })
	userId: string;

	@PrimaryColumn({ type: 'bigint', name: 'RolId' })
	roleId: string;

	@ManyToOne(() => User, user => user.roles)
	@JoinColumn({ name: 'UsuarioId' })
	user: User;

	@ManyToOne(() => Role, role => role.users)
	@JoinColumn({ name: 'RolId' })
	role: Role;

	@ApiHideProperty()
	@Exclude()
	@Column({ update: false, comment: 'Creador', type: 'bigint', nullable: true, name: 'CreadoPor' })
	createdBy: string;

	@ApiHideProperty()
	@Exclude()
	@Column({ comment: 'Actualizador', type: 'bigint', nullable: true, name: 'ModificadoPor' })
	@IsOptional()
	updatedBy: string;

	@ApiHideProperty()
	@CreateDateColumn({
		nullable: true,
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		name: 'FechaCreacion'
	})
	createdAt: Date;

	@ApiHideProperty()
	@UpdateDateColumn({
		nullable: true,
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)',
		name: 'FechaModificado'
	})
	updatedAt: Date;
}
