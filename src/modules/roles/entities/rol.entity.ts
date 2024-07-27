import { CompleteEntity } from "src/core/common/entity/common.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity({ name: 'rol' })
export class Rol extends CompleteEntity {
	@Column({ type: 'varchar', length: 50 })
	Nombre: string;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true })
	Descripcion: string;

	@ManyToMany(() => User, user => user.roles)
	usuarios: User[];
}
