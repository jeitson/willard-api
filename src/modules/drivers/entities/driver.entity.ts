import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { CollectionRequest } from "src/modules/collection_request/entities/collection_request.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity({ name: 'conductor' })
export class Driver extends CompleteEntity {
	@OneToOne(() => CollectionRequest, request => request.route)
    @JoinColumn({ name: 'SolicitudRecogidaId' })
    collectionRequest: CollectionRequest;

	@ApiProperty({ description: 'name' })
	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'document' })
	@Column({ type: 'varchar', length: 50, name: 'Cedula' })
	document: string;

	@ApiProperty({ description: 'cellphone' })
	@Column({ type: 'varchar', length: 50, name: 'Cedula' })
	cellphone: string;

	@ApiProperty({ description: 'email' })
	@Column({ type: 'varchar', length: 100, name: 'Correo', default: null, nullable: true })
	email: string;

	@ApiProperty({ description: 'description' })
	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Descripcion' })
	description: string;
}
