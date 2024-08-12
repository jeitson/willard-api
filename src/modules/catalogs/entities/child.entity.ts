import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Parent } from "./parent.entity";

@Entity({ name: 'catalogo_hijo' })
export class Child extends CompleteEntity {
	@Column({ type: 'bigint', name: 'PadreId' })
	parentId: number;

	@Column({ type: 'varchar', length: 50, name: 'CodigoCatalogo' })
	catalogCode: string;

	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Descripcion' })
	description: string;

	@Column({ type: 'int', default: null, nullable: true, name: 'Orden' })
	order: number;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Extra1' })
	extra1: string;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Extra2' })
	extra2: string;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Extra3' })
	extra3: string;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Extra4' })
	extra4: string;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Extra5' })
	extra5: string;

	@ManyToOne(() => Parent, (parent) => parent.children)
	parent: Parent;
}
