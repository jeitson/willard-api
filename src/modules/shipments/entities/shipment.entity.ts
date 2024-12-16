import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { CollectionSite } from "src/modules/collection_sites/entities/collection_site.entity";
import { Transporter } from "src/modules/transporters/entities/transporter.entity";
import { ShipmentPhoto } from "./shipment_photo.entity";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { ShipmentDetail } from "./shipment_detail.entity";
import { ShipmentERC } from "./shipment_erc.entity";

@Entity({ name: 'envio' })
export class Shipment extends CompleteEntity {

	@ManyToOne(() => CollectionSite, (collectionSite) => collectionSite.collectionsRequests)
	@JoinColumn({ name: 'SedeAcopioId' })
	@ApiProperty({ description: 'Sede de acopio' })
	collectionSite: CollectionSite;

	@ManyToOne(() => Transporter, (transporter) => transporter.collectionsRequests)
	@JoinColumn({ name: 'TransportadoraId' })
	@ApiProperty({ description: 'Transportadora' })
	transporter: Transporter;

	@ApiProperty({ description: 'Placa del vehículo' })
	@Column({ type: 'varchar', length: 20, name: 'Placa' })
	licensePlate: string;

	@ApiProperty({ description: 'Conductor' })
	@Column({ type: 'varchar', length: 50, name: 'Conductor' })
	driver: string;

	@ApiProperty({ description: 'Número de guía' })
	@Column({ type: 'varchar', length: 50, name: 'NumeroGuia' })
	guideNumber: string;

	@ApiProperty({ description: 'Documento de referencia 1' })
	@Column({ type: 'varchar', length: 50, name: 'DocReferencia1', nullable: true })
	referenceDoc1: string;

	@ApiProperty({ description: 'Documento de referencia 2' })
	@Column({ type: 'varchar', length: 50, name: 'DocReferencia2', nullable: true })
	referenceDoc2: string;

	@ApiProperty({ description: 'Estado del envío 1' })
	@Column({ type: 'int', name: 'EnvioEstado' })
	shipmentStatusId: number;

	@OneToMany(() => ShipmentDetail, (detail) => detail.shipment)
	shipmentDetails: ShipmentDetail[];

	@OneToMany(() => ShipmentPhoto, (photo) => photo.shipment)
	shipmentPhotos: ShipmentPhoto[];

	@OneToMany(() => ShipmentERC, (erc) => erc.shipment)
	shipmentERC: ShipmentERC[];
}
