import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'cliente' })
export class Client extends CompleteEntity {
	@ApiProperty({ description: 'name' })
	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'description' })
	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Descripcion' })
	description: string;

	@ApiProperty({ description: 'businessName' })
	@Column({ type: 'varchar', length: 255, name: 'RazonSocial' })
	businessName: string;

	@ApiProperty({ description: 'documentTypeId' })
	@Column({ type: 'bigint', name: 'TipoDocumentoId' })
	documentTypeId: number;

	@ApiProperty({ description: 'countryId' })
	@Column({ type: 'bigint', name: 'PaisId' })
	countryId: number;

	@ApiProperty({ description: 'documentNumber' })
	@Column({ type: 'varchar', length: 50, name: 'NumeroDocumento' })
	documentNumber: string;

	@ApiProperty({ description: 'referenceWLL' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaWLL' })
	referenceWLL: string;

	@ApiProperty({ description: 'referencePH' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaPH' })
	referencePH: string;
}
