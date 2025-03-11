import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, OneToMany, JoinColumn, OneToOne } from "typeorm";
import { CollectionSite } from "src/modules/collection_sites/entities/collection_site.entity";
import { Transporter } from "src/modules/transporters/entities/transporter.entity";
import { ReceptionDetail } from "./reception_detail.entity";
import { ReceptionPhoto } from "./reception_photo.entity";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { AuditRoute } from "src/modules/audit_route/entities/audit_route.entity";

@Entity({ name: 'recepcion' })
export class Reception extends CompleteEntity {

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

	@ApiProperty({ description: 'Número de Ruta' })
	@Column({ type: 'varchar', length: 50, name: 'RutaId' })
	routeId: string;

	@ApiProperty({ description: 'Documento de referencia 1' })
	@Column({ type: 'varchar', length: 50, name: 'DocReferencia1', nullable: true })
	referenceDoc1: string;

	@ApiProperty({ description: 'Documento de referencia 2' })
	@Column({ type: 'varchar', length: 50, name: 'DocReferencia2', nullable: true })
	referenceDoc2: string;

	@ApiProperty({ description: 'Estado de recepción 1' })
	@Column({ type: 'int', name: 'RecepcionEstado1' })
	receptionStatusId: number;

	@OneToMany(() => ReceptionDetail, (receptionDetail) => receptionDetail.reception)
	receptionDetails: ReceptionDetail[];

	@OneToMany(() => ReceptionPhoto, (photo) => photo.reception)
	receptionPhotos: ReceptionPhoto[];

	@OneToOne(() => AuditRoute, (auditRoute) => auditRoute.reception)
	auditRoute: AuditRoute;
}
