import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'transportador' })
export class Transporter extends CompleteEntity {
	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@Column({ type: 'varchar', length: 20, name: 'Nit' })
	taxId: string;

	@Column({ type: 'varchar', length: 255, name: 'RazonSocial' })
	businessName: string;

	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Descripcion' })
	description: string;

	@Column({ type: 'varchar', length: 100, name: 'NombreContacto' })
	contactName: string;

	@Column({ type: 'varchar', length: 100, name: 'EmailContacto' })
	contactEmail: string;

	@Column({ type: 'varchar', length: 255, name: 'ReferenciaWLL' })
	referenceWLL: string;

	@Column({ type: 'varchar', length: 255, name: 'ReferenciaPH' })
	referencePH: string;
}
