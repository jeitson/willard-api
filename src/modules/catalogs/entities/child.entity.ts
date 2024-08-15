import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Parent } from "./parent.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'catalogo_hijo' })
export class Child extends CompleteEntity {
	@ApiProperty({ description: 'parentId' })
	@Column({ type: 'bigint', name: 'PadreId' })
	parentId: number;

	@ApiProperty({ description: 'catalogCode' })
	@Column({ type: 'varchar', length: 50, name: 'CodigoCatalogo' })
	catalogCode: string;

	@ApiProperty({ description: 'name' })
	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'description' })
	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Descripcion' })
	description: string;

	@ApiProperty({ description: 'order' })
	@Column({ type: 'int', default: null, nullable: true, name: 'Orden' })
	order: number;

	@ApiProperty({ description: 'extra1' })
	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Extra1' })
	extra1: string;

	@ApiProperty({ description: 'extra2' })
	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Extra2' })
	extra2: string;

	@ApiProperty({ description: 'extra3' })
	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Extra3' })
	extra3: string;

	@ApiProperty({ description: 'extra4' })
	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Extra4' })
	extra4: string;

	@ApiProperty({ description: 'extra5' })
	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Extra5' })
	extra5: string;

	@ApiProperty({ description: 'parent' })
	@ManyToOne(() => Parent, (parent) => parent.children)
	parent: Parent;
}
