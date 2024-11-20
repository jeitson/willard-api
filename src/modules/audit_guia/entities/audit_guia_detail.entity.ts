import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "src/modules/products/entities/product.entity";
import { AuditGuia } from "./audit_guia.entity";

@Entity({ name: 'auditoria_guia_detalle' })
export class AuditGuiaDetail extends CompleteEntity {
	@ApiProperty({ description: 'ID de recepción (FK)' })
	@ManyToOne(() => AuditGuia, (auditGuia) => auditGuia.auditGuiaDetails)
	@JoinColumn({ name: 'AuditoriaGuiaId' })
	auditGuia: AuditGuia;

	@ApiProperty({ description: 'Es Recuperadora' })
	@Column({ type: 'boolean', name: 'EsRecuperadora', nullable: true, default: null })
	isRecuperator: boolean;

	@ApiProperty({ description: 'ID del producto' })
	@ManyToOne(() => Product, (product) => product.auditGuiaDetails)
	@JoinColumn({ name: 'ProductoId' })
	product: Product;

	@ApiProperty({ description: 'Cantidad' })
	@Column({ type: 'int', name: 'Cantidad' })
	quantity: number;

	@ApiProperty({ description: 'Cantidad Corregida' })
	@Column({ type: 'int', name: 'CantidadCorregida' })
	quantityCollection: number;
}
