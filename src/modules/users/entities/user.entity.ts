import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { UserRole } from "./user-rol.entity";

@Entity({ name: 'usuario' })
export class User extends CompleteEntity {
	@Column({ unique: true, type: 'bigint', default: null, nullable: true, name: 'OauthId' })
	oauthId: string;

	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Descripcion' })
	description: string;

	@Column({ type: 'varchar', length: 255, name: 'Email' })
	email: string;

	@OneToMany(() => UserRole, userRole => userRole.user)
	roles: UserRole[];
}
