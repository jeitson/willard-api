import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Child } from "./child.entity";

@Entity({ name: 'catalogo_padre' })
export class Parent extends CompleteEntity {
	@Column({ unique: true, type: 'varchar', length: 50, name: 'Codigo' })
	code: string;

	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Descripcion' })
	description: string;

	@OneToMany(() => Child, (child) => child.parent)
	children: Child[];
}
