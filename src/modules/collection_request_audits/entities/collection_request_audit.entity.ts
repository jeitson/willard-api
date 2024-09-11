import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { CollectionRequest } from "src/modules/collection_request/entities/collection_request.entity";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";

@Entity({ name: 'solicitud_recogida_auditoria' })
export class CollectionRequestAudit extends CompleteEntity {

	@ManyToOne(() => CollectionRequest, collectionRequest => collectionRequest.audits)
	@JoinColumn({ name: 'SolicitudRecogidaId' })
	collectionRequest: CollectionRequest;

	@ApiProperty({ description: 'Estado de solicitud' })
	@Column({ type: 'bigint', name: 'EstadoSolicitudId' })
	statusId: number;

	@ApiProperty({ description: 'Nombre' })
	@Column({ type: 'varchar', length: 255, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'Descripción' })
	@Column({ type: 'varchar', length: 1000, nullable: true, name: 'Descripcion' })
	description: string;
}
