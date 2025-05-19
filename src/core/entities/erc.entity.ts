import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'erc' })
export class Erc extends CompleteEntity {
	@ApiProperty({ description: 'Radicado' })
	@Column({ type: 'varchar', length: 50, name: 'Radicado' })
	residing: string;

	@ApiProperty({ description: 'ErcId' })
	@Column({
		type: 'varchar',
		length: 50,
		default: null,
		nullable: true,
		name: 'ErcId',
		unique: true
	})
	ercId: string;

	@ApiProperty({ description: 'Agencia' })
	@Column({ type: 'varchar', length: 25, default: null, nullable: true, name: 'Agencia' })
	agency: string;

	@ApiProperty({ description: 'Factura' })
	@Column({ type: 'varchar', length: 50, default: null, nullable: true, name: 'Factura' })
	invoice: string;

	@ApiProperty({ description: 'EntregadoPor' })
	@Column({ type: 'varchar', length: 50, default: null, nullable: true, name: 'EntregadoPor' })
	deliveredBy: string;

	@ApiProperty({ description: 'Observacion' })
	@Column({ type: 'varchar', length: 100, default: null, nullable: true, name: 'Observacion' })
	observation: string;

	@ApiProperty({ description: 'Fecha' })
	@Column({ type: 'varchar', length: 100, default: null, nullable: true, name: 'Fecha' })
	date: string;
}
