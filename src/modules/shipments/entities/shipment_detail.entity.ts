import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "src/modules/products/entities/product.entity";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Shipment } from "./shipment.entity";

@Entity({ name: 'envio_detalle' })
export class ShipmentDetail extends CompleteEntity {

	@ApiProperty({ description: 'ID del envio (FK)' })
	@ManyToOne(() => Shipment, (shipment) => shipment.shipmentDetails)
	@JoinColumn({ name: 'EnvioId' })
	shipment: Shipment;

	@ApiProperty({ description: 'ID del producto' })
	@ManyToOne(() => Product, (product) => product.shipmentDetails)
	@JoinColumn({ name: 'ProductoId' })
	product: Product;

	@ApiProperty({ description: 'Cantidad' })
	@Column({ type: 'bigint', name: 'Cantidad' })
	quantity: number;
}
