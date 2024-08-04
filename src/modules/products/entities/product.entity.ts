import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'producto' })
export class Product extends CompleteEntity{
	@Column({ type: 'bigint' })
	TipoProductoId: number;

	@Column({ type: 'bigint' })
	UnidadMedidaId: number;

	@Column({ type: 'varchar', length: 50 })
	Nombre: string;

	@Column({ type: 'bigint' })
	KgPromedio: number;

	@Column({ type: 'decimal', precision: 8, scale: 2, default: 0, })
	PorcentajeRecuperacion: number;

	@Column({ type: 'boolean', default: false })
	EsCertificable: boolean;

	@Column({ type: 'varchar', length: 255, nullable: true, default: null })
	Referencia1: string;

	@Column({ type: 'varchar', length: 255, nullable: true, default: null })
	Referencia2: string;

	@Column({ type: 'varchar', length: 255, nullable: true, default: null })
	Referencia3: string;

	@Column({ type: 'varchar', length: 255, nullable: true, default: null })
	Descripcion: string;

	@Column({ type: 'varchar', length: 255 })
	ReferenciaWLL: string;

	@Column({ type: 'varchar', length: 255 })
	ReferenciaPH: string;
}
