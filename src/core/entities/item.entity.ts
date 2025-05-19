import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'item' })
export class Item extends CompleteEntity {
	@ApiProperty({ description: 'IrcId' })
	@Column({ type: 'varchar', length: 50, default: null, nullable: true, name: 'IrcId' })
	ircId: string;

	@ApiProperty({ description: 'Referencia' })
	@Column({ type: 'varchar', length: 25, default: null, nullable: true, name: 'Referencia' })
	reference: string;

	@ApiProperty({ description: 'Cantidad' })
	@Column({ type: 'varchar', length: 25, default: null, nullable: true, name: 'Cantidad' })
	quantity: string;

	@ApiProperty({ description: 'OtroTipoDocumento' })
	@Column({ type: 'varchar', length: 25, default: null, nullable: true, name: 'OtroTipoDocumento' })
	otherDocumentType: string;

	@ApiProperty({ description: 'OtroNumeroDocumento' })
	@Column({ type: 'varchar', length: 25, default: null, nullable: true, name: 'OtroNumeroDocumento' })
	otherDocumentNumber: string;
}
