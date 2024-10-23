import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Shipment } from "./shipment.entity";

@Entity({ name: 'envio_foto' })
export class ShipmentPhoto extends CompleteEntity {
	@ApiProperty({ description: 'ID del envio (FK)' })
	@ManyToOne(() => Shipment, (shipment) => shipment.shipmentPhotos)
	@JoinColumn({ name: 'EnvioId' })
	shipment: Shipment;

	@ApiProperty({ description: 'URL de la foto' })
	@Column({ type: 'varchar', length: 255, name: 'Url' })
	url: string;
}
