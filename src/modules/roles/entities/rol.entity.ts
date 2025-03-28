import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { UserRole } from "src/modules/users/entities/user-rol.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToMany, OneToMany } from "typeorm";

@Entity({ name: 'rol' })
export class Role extends CompleteEntity {
	@ApiProperty({ description: 'Name' })
	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'Description' })
	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Descripcion' })
	description: string;

	@ApiProperty({ description: 'JSON Menú' })
	@Column({ type: 'varchar', length: 800, default: '[]', nullable: true, name: 'Menujson' })
	menu: string = '[]';

	@ApiProperty({ description: 'Usuarios asociados a este rol' })
	@OneToMany(() => UserRole, userRol => userRol.user)
	userRoles: UserRole[];
}
