import { CompleteEntity } from "src/core/common/entity/common.entity";
import { UserRol } from "src/modules/users/entities/user-rol.entity";
import { Column, Entity, ManyToMany, JoinTable, OneToMany } from "typeorm";
@Entity({ name: 'usuario' })
export class User extends CompleteEntity {
	@Column({ unique: true, type: 'bigint', default: null, nullable: true })
	OauthId: string;

	@Column({ type: 'varchar', length: 50 })
	Nombre: string;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true })
	Descripcion: string;

	@Column({ type: 'varchar', length: 255 })
	Email: string;

	@OneToMany(() => UserRol, userRol => userRol.usuario)
	roles: UserRol[];
}
