import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Client } from "src/modules/clients/entities/client.entity";
import { PickUpLocation } from "src/modules/pick_up_location/entities/pick_up_location.entity";
import { CollectionSite } from "src/modules/collection_sites/entities/collection_site.entity";
import { Column, Entity, ManyToOne, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { Transporter } from "src/modules/transporters/entities/transporter.entity";
import { CollectionRequestAudit } from "src/modules/collection_request_audits/entities/collection_request_audit.entity";
import { Route } from "src/modules/routes/entities/route.entity";
import { User } from "src/modules/users/entities/user.entity";

@Entity({ name: 'solicitud_recogida' })
export class CollectionRequest extends CompleteEntity {

	@ManyToOne(() => Client, (client) => client.collectionsRequests)
	@JoinColumn({ name: 'ClienteId' })
	client: Client;

	@ManyToOne(() => PickUpLocation, (pickUpLocation) => pickUpLocation.collectionsRequests)
	@JoinColumn({ name: 'LugarRecogidaId' })
	pickUpLocation: PickUpLocation;

	@ManyToOne(() => CollectionSite, (collectionSite) => collectionSite.collectionsRequests)
	@JoinColumn({ name: 'SedeAcopioId' })
	collectionSite: CollectionSite;

	@ManyToOne(() => Transporter, (transporter) => transporter.collectionsRequests)
	@JoinColumn({ name: 'TransportadoraId' })
	transporter: Transporter;

	@ManyToOne(() => User, (user) => user.collectionsRequests)
	@JoinColumn({ name: 'AsesorId' })
	user: User;

	@ApiProperty({ description: 'Nombre' })
	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'Descripción' })
	@Column({ type: 'varchar', length: 255, nullable: true, name: 'Descripcion' })
	description: string;

	@ApiProperty({ description: 'Fecha de solicitud' })
	@Column({ type: 'date', name: 'FechaSolicitud' })
	requestDate: string;

	@ApiProperty({ description: 'Hora de solicitud' })
	@Column({ type: 'time', name: 'HoraSolicitud' })
	requestTime: string;

	@ApiProperty({ description: 'Cantidad estimada' })
	@Column({ type: 'int', name: 'CantidadEstimada' })
	estimatedQuantity: number;

	@ApiProperty({ description: 'KG estimados' })
	@Column({ type: 'int', name: 'KGEstimados' })
	estimatedKG: number;

	@ApiProperty({ description: 'Es especial' })
	@Column({ type: 'boolean', name: 'EsEspecial' })
	isSpecial: boolean;

	@ApiProperty({ description: 'Estado de la solicitud' })
	@Column({ type: 'int', name: 'EstadoSolicitudId' })
	requestStatusId: number;

	@ApiProperty({ description: 'Fecha estimada de recogida' })
	@Column({ type: 'date', nullable: true, name: 'FechaEstimadaRecogida' })
	estimatedPickUpDate: string;

	@ApiProperty({ description: 'Hora estimada de recogida' })
	@Column({ type: 'time', nullable: true, name: 'HoraEstimadaRecogida' })
	estimatedPickUpTime: string;

	@ApiProperty({ description: 'Observaciones' })
	@Column({ type: 'varchar', length: 255, nullable: true, name: 'Observaciones' })
	observations: string;

	@ApiProperty({ description: 'Recomendaciones' })
	@Column({ type: 'varchar', length: 255, nullable: true, name: 'Recomendaciones' })
	recommendations: string;

	@OneToMany(() => CollectionRequestAudit, (collectionRequestAudit) => collectionRequestAudit.collectionRequest)
	audits: CollectionRequestAudit[];

	@OneToOne(() => Route, (route) => route.collectionRequest)
	route: Route;
}
