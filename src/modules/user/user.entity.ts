import { Exclude } from 'class-transformer';
import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	Relation,
} from 'typeorm';

import { RoleEntity } from '../system/role/role.entity';
import { DeptEntity } from '../system/dept/dept.entity';
import { AccessTokenEntity } from '../auth/entities/access-token.entity';
import { CommonEntity } from 'src/core/common/entity/common.entity';

@Entity({ name: 'sys_user' })
export class UserEntity extends CommonEntity {
	@Column({ unique: true })
	username: string;

	@Exclude()
	@Column()
	password: string;

	@Column({ length: 32 })
	psalt: string;

	@Column({ nullable: true })
	nickname: string;

	@Column({ name: 'avatar', nullable: true })
	avatar: string;

	@Column({ nullable: true })
	email: string;

	@Column({ nullable: true })
	phone: string;

	@Column({ nullable: true })
	remark: string;

	@ManyToMany(() => RoleEntity, (role) => role.users)
	@JoinTable({
		name: 'sys_user_roles',
		joinColumn: { name: 'user_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
	})
	roles: Relation<RoleEntity[]>;

	@ManyToOne(() => DeptEntity, (dept) => dept.users)
	@JoinColumn({ name: 'dept_id' })
	dept: Relation<DeptEntity>;

	@OneToMany(() => AccessTokenEntity, (accessToken) => accessToken.user, {
		cascade: true,
	})
	accessTokens: Relation<AccessTokenEntity[]>;
}
