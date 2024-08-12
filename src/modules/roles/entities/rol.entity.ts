import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity({ name: 'rol' })
export class Role extends CompleteEntity {
	@ApiProperty({ description: 'Name' })
	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'Description' })
	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Descripcion' })
	description: string;

	@ManyToMany(() => User, user => user.roles)
	users: User[];
}
