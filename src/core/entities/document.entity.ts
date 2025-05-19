import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'documento' })
export class Document extends CompleteEntity {
	@ApiProperty({ description: 'Radicado' })
	@Column({ type: 'varchar', length: 50, name: 'Radicado' })
	residing: string;

	@ApiProperty({ description: 'Remision' })
	@Column({ type: 'varchar', length: 50, name: 'Remision' })
	remission: string;

	@ApiProperty({ description: 'Guia' })
	@Column({ type: 'varchar', length: 25, default: null, nullable: true, name: 'Guia' })
	guide: string;

	@ApiProperty({ description: 'Agencia' })
	@Column({ type: 'varchar', length: 50, default: null, nullable: true, name: 'Agencia' })
	agency: string;

	@ApiProperty({ description: 'Fecha' })
	@Column({ type: 'varchar', length: 100, default: null, nullable: true, name: 'Fecha' })
	date: string;

	@ApiProperty({ description: 'RecibidoPor' })
	@Column({ type: 'varchar', length: 50, default: null, nullable: true, name: 'RecibidoPor' })
	receivedBy: string;

	@ApiProperty({ description: 'Transportadora' })
	@Column({ type: 'varchar', length: 50, default: null, nullable: true, name: 'Transportadora' })
	transporter: string;

	@ApiProperty({ description: 'Placa' })
	@Column({ type: 'varchar', length: 15, default: null, nullable: true, name: 'Placa' })
	plate: string;

	@ApiProperty({ description: 'Conductor' })
	@Column({ type: 'varchar', length: 50, default: null, nullable: true, name: 'Conductor' })
	driver: string;

	@ApiProperty({ description: 'Recuperador' })
	@Column({ type: 'varchar', length: 50, default: null, nullable: true, name: 'Recuperador' })
	recuperator: string;

	@ApiProperty({ description: 'Observacion' })
	@Column({ type: 'varchar', length: 100, default: null, nullable: true, name: 'Observacion' })
	observation: string;
}
