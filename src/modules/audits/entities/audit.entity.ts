import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'auditoria' })
export class Audit extends CompleteEntity {
	@ApiProperty({ description: 'userId' })
	@Column({ type: 'bigint', name: 'UsuarioId' })
	userId: string;

	@ApiProperty({ description: 'name' })
	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'description' })
	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Descripcion' })
	description: string;
}
