import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "src/modules/products/entities/product.entity";
import { AuditGuide } from "./audit_guide.entity";

@Entity({ name: 'auditoria_guia_detalle' })
export class AuditGuideDetail extends CompleteEntity {
	@ApiProperty({ description: 'ID de recepción (FK)' })
	@ManyToOne(() => AuditGuide, (auditGuide) => auditGuide.auditGuideDetails)
	@JoinColumn({ name: 'AuditoriaGuiaId' })
	auditGuide: AuditGuide;

	@Column({ type: 'bigint', name: 'AuditoriaGuiaId', nullable: false })
	auditGuideId: number;

	@ApiProperty({ description: 'Es Recuperadora' })
	@Column({ type: 'boolean', name: 'EsRecuperadora', nullable: true, default: null })
	isRecuperator: boolean;

	@ApiProperty({ description: 'ID del producto' })
	@ManyToOne(() => Product, (product) => product.auditGuideDetails)
	@JoinColumn({ name: 'ProductoId' })
	product: Product;

	@ApiProperty({ description: 'Cantidad' })
	@Column({ type: 'int', name: 'Cantidad' })
	quantity: number;

	@ApiProperty({ description: 'Cantidad Corregida' })
	@Column({ type: 'int', name: 'CantidadCorregida' })
	quantityCollection: number;
}
