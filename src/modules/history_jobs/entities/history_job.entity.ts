import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'proceso_historial' })
export class HistoryJob extends CompleteEntity {
	@ApiProperty({ description: 'Llave' })
	@Column({ type: 'varchar', length: 25, name: 'Llave' })
	key: string;

	@ApiProperty({ description: 'Nombre' })
	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'Description' })
	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Descripcion' })
	description: string;

	@ApiProperty({ description: 'Contenido de Entrada' })
	@Column({ type: 'varchar', length: 400, default: '[]', nullable: true, name: 'ContenidoEntrada' })
	inputContent: string = '[]';

	@ApiProperty({ description: 'Contenido de Salida' })
	@Column({ type: 'varchar', length: 400, default: '[]', nullable: true, name: 'ContenidoSalida' })
	outputContent: string = '[]';

	@ApiProperty({ description: 'Estado del Proceso' })
	@Column({ type: 'enum', enum: ['SUCCESS', 'ERROR'] })
	statusProcess: 'SUCCESS' | 'ERROR' = 'SUCCESS';
}
