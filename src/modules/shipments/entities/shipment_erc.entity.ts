import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Shipment } from "./shipment.entity";

@Entity({ name: 'envio_erc' })
export class ShipmentERC extends CompleteEntity {
	@ApiProperty({ description: 'ID del envio (FK)' })
	@ManyToOne(() => Shipment, (shipment) => shipment.shipmentPhotos)
	@JoinColumn({ name: 'EnvioId' })
	shipment: Shipment;

	@ApiProperty({ description: 'Texto del ERC' })
	@Column({ type: 'varchar', length: 255, name: 'Nombre' })
	name: string;
}
