import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "src/modules/products/entities/product.entity";
import { AuditRoute } from "src/modules/audit_route/entities/audit_route.entity";

@Entity({ name: 'nota_credito' })
export class NotesCredit extends CompleteEntity {
	@JoinColumn({ name: 'AuditoriaRutaId' })
	@ApiProperty({ description: 'ID de la auditoria ruta (FK)' })
	@ManyToOne(() => AuditRoute, (auditRoute) => auditRoute.notesCredits)
	auditRoute: AuditRoute;

	@ApiProperty({ description: 'Guia ID' })
	@Column({ type: 'varchar', length: 20,  name: 'GuiaId', nullable: false })
	guideId: string;

	@ManyToOne(() => Product, (product) => product.noteCredits)
	@JoinColumn({ name: 'ProductoId' })
	product: Product;

	@ApiProperty({ description: 'Cantidad' })
	@Column({ type: 'int', name: 'Cantidad' })
	quantity: number;

	@ApiProperty({ description: 'Estado de la Nota Credito' })
	@Column({ type: 'bigint', name: 'EstadoId' })
	requestStatusId: number;
}
