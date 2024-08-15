import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'producto' })
export class Product extends CompleteEntity {
	@ApiProperty({ description: 'productTypeId' })
	@Column({ type: 'bigint', name: 'TipoProductoId' })
	productTypeId: number;

	@ApiProperty({ description: 'unitMeasureId' })
	@Column({ type: 'bigint', name: 'UnidadMedidaId' })
	unitMeasureId: number;

	@ApiProperty({ description: 'name' })
	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'averageKg' })
	@Column({ type: 'bigint', name: 'KgPromedio' })
	averageKg: number;

	@ApiProperty({ description: 'recoveryPercentage' })
	@Column({ type: 'numeric', precision: 8, scale: 2, default: 0, name: 'PorcentajeRecuperacion' })
	recoveryPercentage: string;

	@ApiProperty({ description: 'isCertifiable' })
	@Column({ type: 'boolean', default: false, name: 'EsCertificable' })
	isCertifiable: boolean;

	@ApiProperty({ description: 'reference1' })
	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Referencia1' })
	reference1: string;

	@ApiProperty({ description: 'reference2' })
	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Referencia2' })
	reference2: string;

	@ApiProperty({ description: 'reference3' })
	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Referencia3' })
	reference3: string;

	@ApiProperty({ description: 'description' })
	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Descripcion' })
	description: string;

	@ApiProperty({ description: 'referenceWLL' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaWLL' })
	referenceWLL: string;

	@ApiProperty({ description: 'referencePH' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaPH' })
	referencePH: string;
}
