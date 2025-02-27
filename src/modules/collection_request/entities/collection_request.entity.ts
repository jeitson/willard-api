import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Client } from "src/modules/clients/entities/client.entity";
import { PickUpLocation } from "src/modules/pick_up_location/entities/pick_up_location.entity";
import { CollectionSite } from "src/modules/collection_sites/entities/collection_site.entity";
import { Column, Entity, ManyToOne, JoinColumn, OneToMany, OneToOne, CreateDateColumn } from "typeorm";
import { Transporter } from "src/modules/transporters/entities/transporter.entity";
import { CollectionRequestAudit } from "src/modules/collection_request_audits/entities/collection_request_audit.entity";
import { Route } from "src/modules/routes/entities/route.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Driver } from "src/modules/drivers/entities/driver.entity";
import { Expose } from "class-transformer";

@Entity({ name: 'solicitud_recogida' })
export class CollectionRequest extends CompleteEntity {

	@ManyToOne(() => Client, (client) => client.collectionsRequests)
	@JoinColumn({ name: 'ClienteId' })
	client: Client;

	@ManyToOne(() => PickUpLocation, (pickUpLocation) => pickUpLocation.collectionsRequests)
	@JoinColumn({ name: 'LugarRecogidaId' })
	pickUpLocation: PickUpLocation;

	@Column({ type: 'bigint', name: 'TipoProductoId' })
	productTypeId: number;

	@ManyToOne(() => CollectionSite, (collectionSite) => collectionSite.collectionsRequests)
	@JoinColumn({ name: 'SedeAcopioId' })
	collectionSite: CollectionSite;

	@ManyToOne(() => Transporter, (transporter) => transporter.collectionsRequests)
	@JoinColumn({ name: 'TransportadoraId' })
	transporter: Transporter;

	@ManyToOne(() => User, (user) => user.collectionsRequests)
	@JoinColumn({ name: 'AsesorId' })
	user: User;

	@Column({ type: 'varchar', length: 50, name: 'Nombre', nullable: true, default: 'SOLICITUD DE RECOGIDA' })
	name: string = 'SOLICITUD DE RECOGIDA';

	@Column({ type: 'varchar', length: 255, nullable: true, name: 'Descripcion' })
	description: string;

	@Column({ type: 'bigint', nullable: true, name: 'MotivoEspecialId' })
	motiveSpecialId: number;

	@Expose()
	@CreateDateColumn({
		type: 'date',
		default: () => 'CURRENT_DATE',
		name: 'FechaSolicitud',
		nullable: true,
	})
	requestDate: Date;

	@Column({
		type: 'time',
		name: 'HoraSolicitud',
		default: () => 'CURRENT_TIME',
		nullable: true,
	})
	requestTime: string;

	@ApiProperty({ description: 'Número de guía' })
	@Column({ type: 'varchar', length: 20, name: 'NumeroGuia', nullable: true, default: null })
	guideNumber: string;

	@Column({ type: 'int', name: 'CantidadEstimada' })
	estimatedQuantity: number;

	@Column({ type: 'int', name: 'KGEstimados' })
	estimatedKG: number;

	@Column({ type: 'boolean', name: 'EsEspecial' })
	isSpecial: boolean;

	@Column({ type: 'int', name: 'EstadoSolicitudId' })
	requestStatusId: number;

	@Column({ type: 'date', nullable: true, name: 'FechaEstimadaRecogida' })
	estimatedPickUpDate: string;

	@Column({ type: 'time', nullable: true, name: 'HoraEstimadaRecogida' })
	estimatedPickUpTime: string;

	@Column({ type: 'varchar', length: 255, nullable: true, name: 'Observaciones' })
	observations: string;

	@Column({ type: 'varchar', length: 255, nullable: true, name: 'Recomendaciones' })
	recommendations: string;

	@Column({ type: 'varchar', length: 20, name: 'IdRuta', nullable: true })
    routeId: string;

	@OneToMany(() => CollectionRequestAudit, (collectionRequestAudit) => collectionRequestAudit.collectionRequest)
	audits: CollectionRequestAudit[];

	@OneToOne(() => Route, (route) => route.collectionRequest)
	route: Route;

	@OneToOne(() => Driver, (driver) => driver.collectionRequest)
	driver: Driver;
}
