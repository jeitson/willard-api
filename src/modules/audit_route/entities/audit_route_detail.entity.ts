import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "src/modules/products/entities/product.entity";
import { AuditRoute } from "./audit_route.entity";

@Entity({ name: 'auditoria_ruta_detalle' })
export class AuditRouteDetail extends CompleteEntity {
	@ApiHideProperty()
	@ManyToOne(() => AuditRoute, (auditRoute) => auditRoute.auditRouteDetails)
	@JoinColumn({ name: 'AuditoriaId' })
	auditRoute: AuditRoute;

	@ApiProperty({ description: 'Guia ID' })
	@Column({ type: 'varchar', length: 20,  name: 'GuiaId', nullable: true })
	guideId: string;

	@ApiHideProperty()
	@ManyToOne(() => Product, (product) => product.auditRouteDetails)
	@JoinColumn({ name: 'ProductoId' })
	product: Product;

	@ApiProperty({ description: 'Cantidad' })
	@Column({ type: 'int', name: 'Cantidad' })
	quantity: number;

	@ApiProperty({ description: 'Cantidad Conciliada' })
	@Column({ type: 'int', name: 'CantidadConciliada' })
	quantityConciliated: number;
}
