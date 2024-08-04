import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'asesor' })
export class Consultant extends CompleteEntity {
	@Column({ type: 'varchar', length: 50 })
	Nombre: string;

	@Column({ type: 'varchar', length: 100 })
	Email: string;

	@Column({ type: 'varchar', length: 100 })
	Cel: string;

	@Column({ type: 'varchar', length: 255, nullable: true, default: null })
	Descripcion: string;

	@Column({ type: 'varchar', length: 255 })
	ReferenciaPH: string;
}
