import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'producto' })
export class Product extends CompleteEntity {
	@Column({ type: 'bigint', name: 'TipoProductoId' })
	productTypeId: number;

	@Column({ type: 'bigint', name: 'UnidadMedidaId' })
	unitMeasureId: number;

	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@Column({ type: 'bigint', name: 'KgPromedio' })
	averageKg: number;

	@Column({ type: 'decimal', precision: 8, scale: 2, default: 0, name: 'PorcentajeRecuperacion' })
	recoveryPercentage: number;

	@Column({ type: 'boolean', default: false, name: 'EsCertificable' })
	isCertifiable: boolean;

	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Referencia1' })
	reference1: string;

	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Referencia2' })
	reference2: string;

	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Referencia3' })
	reference3: string;

	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Descripcion' })
	description: string;

	@Column({ type: 'varchar', length: 255, name: 'ReferenciaWLL' })
	referenceWLL: string;

	@Column({ type: 'varchar', length: 255, name: 'ReferenciaPH' })
	referencePH: string;
}
