import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'transportador' })
export class Transporter extends CompleteEntity {
	@ApiProperty({ description: 'name' })
	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'taxId' })
	@Column({ type: 'varchar', length: 20, name: 'Nit' })
	taxId: string;

	@ApiProperty({ description: 'businessName' })
	@Column({ type: 'varchar', length: 255, name: 'RazonSocial' })
	businessName: string;

	@ApiProperty({ description: 'description' })
	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Descripcion' })
	description: string;

	@ApiProperty({ description: 'contactName' })
	@Column({ type: 'varchar', length: 100, name: 'NombreContacto' })
	contactName: string;

	@ApiProperty({ description: 'contactEmail' })
	@Column({ type: 'varchar', length: 100, name: 'EmailContacto' })
	contactEmail: string;

	@ApiProperty({ description: 'referenceWLL' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaWLL' })
	referenceWLL: string;

	@ApiProperty({ description: 'referencePH' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaPH' })
	referencePH: string;
}
