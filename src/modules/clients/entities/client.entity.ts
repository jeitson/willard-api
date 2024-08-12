import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'cliente' })
export class Client extends CompleteEntity {
	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Descripcion' })
	description: string;

	@Column({ type: 'varchar', length: 255, name: 'RazonSocial' })
	businessName: string;

	@Column({ type: 'bigint', name: 'TipoDocumentoId' })
	documentTypeId: number;

	@Column({ type: 'bigint', name: 'PaisId' })
	countryId: number;

	@Column({ type: 'varchar', length: 50, name: 'NumeroDocumento' })
	documentNumber: string;

	@Column({ type: 'varchar', length: 255, name: 'ReferenciaWLL' })
	referenceWLL: string;

	@Column({ type: 'varchar', length: 255, name: 'ReferenciaPH' })
	referencePH: string;
}
