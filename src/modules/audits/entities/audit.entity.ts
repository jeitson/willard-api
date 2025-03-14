import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'auditoria' })
export class Audit extends CompleteEntity {
	@ApiProperty({ description: 'userId' })
	@Column({ type: 'varchar', name: 'UsuarioId', length: 50, default: null, nullable: true })
	userId: string;

	@ApiProperty({ description: 'name' })
	@Column({ type: 'varchar', length: 250, name: 'Nombre', nullable: true })
	title: string;

	@ApiProperty({ description: 'description' })
	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Descripcion' })
	description: string;

	@ApiProperty({ description: 'response' })
	@Column({ type: 'varchar', length: 8000, default: null, nullable: true, name: 'Respuesta' })
	response: string;

	@ApiProperty({ description: 'payload' })
	@Column({ type: 'varchar', length: 8000, default: null, nullable: true, name: 'Peticion' })
	payload: string;

	@ApiProperty({ description: 'statusCode' })
	@Column({ type: 'varchar', length: 10, default: null, nullable: true, name: 'CodigoEstado' })
	statusCode: string;

	@ApiProperty({ description: 'method' })
	@Column({ type: 'varchar', length: 10, default: null, nullable: true, name: 'Metodo' })
	method: string;
}
