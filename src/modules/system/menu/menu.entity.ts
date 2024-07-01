import { Column, Entity, ManyToMany, Relation } from 'typeorm';

import { CommonEntity } from 'src/core/common/entity/common.entity';

import { RoleEntity } from '../role/role.entity';

@Entity({ name: 'sys_menu' })
export class MenuEntity extends CommonEntity {
	@Column({ name: 'parent_id', nullable: true })
	parentId: string;

	@Column()
	name: string;

	@Column({ nullable: true })
	path: string;

	@Column({ nullable: true })
	permission: string;

	@Column({ type: 'int', default: 0 })
	type: number;

	@Column({ nullable: true, default: '' })
	icon: string;

	@Column({ name: 'order_no', type: 'int', nullable: true, default: 0 })
	orderNo: number;

	@Column({ name: 'component', nullable: true })
	component: string;

	@Column({ name: 'is_ext', type: 'boolean', default: false })
	isExt: boolean;

	@Column({ name: 'ext_open_mode', type: 'boolean', default: 1 })
	extOpenMode: boolean;

	@Column({ name: 'keep_alive', type: 'boolean', default: 1 })
	keepAlive: boolean;

	@Column({ type: 'boolean', default: 1 })
	show: boolean;

	@Column({ name: 'active_menu', nullable: true })
	activeMenu: string;

	@ManyToMany(() => RoleEntity, (role) => role.menus, {
		onDelete: 'CASCADE',
	})
	roles: Relation<RoleEntity[]>;
}
