import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Client } from "./client.entity";

@Entity({ name: 'cliente_sucursal' })
export class Branch extends CompleteEntity {
	@ApiProperty({ description: 'name' })
	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'description' })
	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Descripcion' })
	description: string;

	@ApiProperty({ description: 'cityId' })
	@Column({ type: 'bigint', name: 'CiudadId' })
	cityId: number;

	@ApiProperty({ description: 'postcard' })
	@Column({ type: 'varchar', length: 50, name: 'Postal' })
	postcard: string;

	@ApiProperty({ description: 'cellphone' })
	@Column({ type: 'varchar', length: 10, name: 'Celular' })
	cellphone: number;

	@ApiProperty({ description: 'phone' })
	@Column({ type: 'varchar', length: 10, name: 'Telefono' })
	phone: number;

	@ApiProperty({ description: 'email' })
	@Column({ type: 'varchar', length: 255, name: 'Email' })
	email: string;

	@ApiProperty({ description: 'referenceWLL' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaWLL' })
	referenceWLL: string;

	@ApiProperty({ description: 'referencePH' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaPH' })
	referencePH: string;

	@ManyToOne(() => Client, (client) => client.branchs)
	@JoinColumn({ name: 'ClienteId' })
	client: Client;
}
