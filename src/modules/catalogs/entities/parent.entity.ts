import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Child } from "./child.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'catalogo_padre' })
export class Parent extends CompleteEntity {
	@ApiProperty({ description: 'code' })
	@Column({ unique: true, type: 'varchar', length: 50, name: 'Codigo' })
	code: string;

	@ApiProperty({ description: 'name' })
	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'description' })
	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Descripcion' })
	description: string;

	@ApiProperty({ description: 'children' })
	@OneToMany(() => Child, (child) => child.parent)
	children: Child[];
}
