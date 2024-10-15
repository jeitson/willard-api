import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { Reception } from "./reception.entity";
import { Product } from "src/modules/products/entities/product.entity";
import { CompleteEntity } from "src/core/common/entity/common.entity";

@Entity({ name: 'recepcion_detalle' })
export class ReceptionDetail extends CompleteEntity {

	@ApiProperty({ description: 'ID de recepción (FK)' })
	@ManyToOne(() => Reception, (reception) => reception.receptionDetails)
	@JoinColumn({ name: 'RecepcionId' })
	reception: Reception;

	@ApiProperty({ description: 'ID del producto' })
	@ManyToOne(() => Product, (product) => product.receptionDetails)
	@JoinColumn({ name: 'ProductoId' })
	product: Product;

	@ApiProperty({ description: 'Cantidad' })
	@Column({ type: 'bigint', name: 'Cantidad' })
	quantity: number;
}
