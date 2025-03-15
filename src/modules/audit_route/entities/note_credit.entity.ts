import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Reception } from "src/modules/receptions/entities/reception.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AuditRouteDetail } from "./audit_route_detail.entity";
import { AuditRoute } from "./audit_route.entity";
import { Product } from "src/modules/products/entities/product.entity";

@Entity({ name: 'nota_credito' })
export class NoteCredit extends CompleteEntity {
	@JoinColumn({ name: 'AuditoriId' })
	@ApiProperty({ description: 'ID de la auditoria (FK)' })
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
