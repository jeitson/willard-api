import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany, Relation } from 'typeorm';

import { CommonEntity } from 'src/core/common/entity/common.entity';

import { UserEntity } from '../../user/user.entity';
import { MenuEntity } from '../menu/menu.entity';

@Entity({ name: 'sys_role' })
export class RoleEntity extends CommonEntity {
	@Column({ length: 50, unique: true })
	@ApiProperty({ description: 'Nombre del rol' })
	name: string;

	@Column({ unique: true })
	@ApiProperty({ description: 'Identificador único del rol' })
	value: string;

	@Column({ nullable: true })
	@ApiProperty({ description: 'Descripción del rol' })
	remark: string;

	@Column({ type: 'boolean', nullable: true, default: 1 })
	@ApiProperty({ description: 'Estado: 1 para activo, 0 para inactivo' })
	status: boolean;

	@Column({ nullable: true })
	@ApiProperty({ description: 'Indicador de rol predeterminado' })
	default: boolean;

	@ApiHideProperty()
	@ManyToMany(() => UserEntity, (user) => user.roles)
	users: Relation<UserEntity[]>;

	@ApiHideProperty()
	@ManyToMany(() => MenuEntity, (menu) => menu.roles, {})
	@JoinTable({
		name: 'sys_role_menus',
		joinColumn: { name: 'role_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'id' },
	})
	menus: Relation<MenuEntity[]>;
}
