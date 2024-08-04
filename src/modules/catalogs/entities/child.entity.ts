import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Parent } from "./parent.entity";

@Entity({ name: 'catalogo_hijo' })
export class Child extends CompleteEntity {
	@Column({ type: 'bigint' })
	PadreId: number;

	@Column({ type: 'varchar', length: 50 })
	CodigoCatalogo: string;

	@Column({ type: 'varchar', length: 50 })
	Nombre: string;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true })
	Descripcion: string;

	@Column({ type: 'int', default: null, nullable: true })
	Orden: number;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true })
	Extra1: string;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true })
	Extra2: string;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true })
	Extra3: string;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true })
	Extra4: string;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true })
	Extra5: string;

	@ManyToOne(() => Parent, (parent) => parent.children)
	parent: Parent;
}
