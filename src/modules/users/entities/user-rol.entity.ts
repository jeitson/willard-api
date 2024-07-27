import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Rol } from '../../roles/entities/rol.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';

@Entity('usuario_rol')
export class UserRol {
	@PrimaryColumn({ type: 'bigint' })
	UsuarioId: string;

	@PrimaryColumn({ type: 'bigint' })
	RolId: string;

	@ManyToOne(() => User, user => user.roles)
	@JoinColumn({ name: 'UsuarioId' })
	usuario: User;

	@ManyToOne(() => Rol, rol => rol.usuarios)
	@JoinColumn({ name: 'RolId' })
	rol: Rol;

	@ApiHideProperty()
	@Exclude()
	@Column({ update: false, comment: 'Creador', type: 'bigint', nullable: true })
	CreadoPor: string;

	@ApiHideProperty()
	@Exclude()
	@Column({ comment: 'Actualizador', type: 'bigint', nullable: true })
	@IsOptional()
	ModificadoPor: string;

	@ApiHideProperty()
	@CreateDateColumn({
		nullable: true,
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
	})
	FechaCreacion: Date;

	@ApiHideProperty()
	@UpdateDateColumn({
		nullable: true,
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)',
	})
	FechaModificado: Date;
}
