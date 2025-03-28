import { Entity, ManyToOne, JoinColumn, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Role } from 'src/modules/roles/entities/rol.entity';
import { CompleteEntity } from 'src/core/common/entity/common.entity';

@Entity('usuario_rol')
export class UserRole extends CompleteEntity {
	@PrimaryColumn({ type: 'bigint', name: 'UsuarioId' })
	userId: string;

	@PrimaryColumn({ type: 'bigint', name: 'RolId' })
	roleId: string;

	@ManyToOne(() => User, user => user.roles)
	@JoinColumn({ name: 'UsuarioId' })
	user: User;

	@ManyToOne(() => Role, role => role.userRoles)
	@JoinColumn({ name: 'RolId' })
	role: Role;
}
