import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'transportador' })
export class Transporter extends CompleteEntity {
	@Column({ type: 'varchar', length: 50 })
	Nombre: string;

	@Column({ type: 'varchar', length: 20 })
	Nit: string;

	@Column({ type: 'varchar', length: 255 })
	RazonSocial: string;

	@Column({ type: 'varchar', length: 255, nullable: true, default: null })
	Descripcion: string;

	@Column({ type: 'varchar', length: 100 })
	NombreContacto: string;

	@Column({ type: 'varchar', length: 100 })
	EmailContacto: string;

	@Column({ type: 'varchar', length: 255 })
	ReferenciaWLL: string;

	@Column({ type: 'varchar', length: 255 })
	ReferenciaPH: string;
}
