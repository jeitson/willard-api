import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'cliente' })
export class Client extends CompleteEntity {
	@Column({ type: 'varchar', length: 50 })
	Nombre: string;

	@Column({ type: 'varchar', length: 255, nullable: true, default: null })
	Descripcion: string;

	@Column({ type: 'varchar', length: 255 })
	RazonSocial: string;

	@Column({ type: 'bigint' })
	TipoDocumentoId: number;

	@Column({ type: 'bigint' })
	PaisId: number;

	@Column({ type: 'varchar', length: 50 })
	NumeroDocumento: string;

	@Column({ type: 'varchar', length: 255 })
	ReferenciaWLL: string;

	@Column({ type: 'varchar', length: 255 })
	ReferenciaPH: string;
}
