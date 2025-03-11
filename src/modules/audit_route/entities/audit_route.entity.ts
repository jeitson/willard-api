import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Reception } from "src/modules/receptions/entities/reception.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { AuditRouteDetail } from "./audit_route_detail.entity";
import { Transporter } from "src/modules/transporters/entities/transporter.entity";
import { CollectionSite } from "src/modules/collection_sites/entities/collection_site.entity";
import { NoteCredit } from "./note_credit.entity";

@Entity({ name: 'auditoria_ruta' })
export class AuditRoute extends CompleteEntity {
	@ApiProperty({ description: 'RutaId' })
	@Column({ type: 'varchar', length: 20, name: 'RutaId', nullable: true })
	routeId: string;

	@JoinColumn({ name: 'RecepcionId' })
	@ApiProperty({ description: 'ID de recepción (FK)' })
	@OneToOne(() => Reception, (reception) => reception.auditRoute)
	reception: Reception;

	@ApiProperty({ description: 'Fecha' })
	@Column({ type: 'varchar', length: 20, name: 'Fecha', nullable: true })
	date: string;

	@ApiProperty({ description: 'Zona ID' })
	@Column({ type: 'bigint', name: 'ZonaId', nullable: true })
	zoneId: number;

	@ApiProperty({ description: 'Recuperadora ID' })
	@Column({ type: 'bigint', name: 'RecuperadoraId', nullable: true, default: null })
	recuperatorId: number;

	@ApiProperty({ description: 'Transportadora ID' })
	@Column({ type: 'bigint', name: 'TransportadoraId', nullable: true, default: null })
	transporterId: number;

	@ApiProperty({ description: 'Recuperadora Total' })
	@Column({ type: 'int', name: 'RecuperadoraTotal', nullable: true, default: null })
	recuperatorTotal: number;

	@ApiProperty({ description: 'Transportadora Total' })
	@Column({ type: 'int', name: 'TransportadoraTotal', nullable: true, default: null })
	transporterTotal: number;

	@ApiProperty({ description: 'Conciliación Total' })
	@Column({ type: 'int', name: 'ConciliacionTotal', nullable: true, default: null })
	conciliationTotal: number;

	@ApiProperty({ description: 'Estado de la auditoria' })
	@Column({ type: 'bigint', name: 'EstadoId' })
	requestStatusId: number;

	@ApiProperty({ description: 'Comentario' })
	@Column({ type: 'varchar', length: 1000, name: 'Comentario', default: null, nullable: true })
	comment: string;

	@OneToMany(() => AuditRouteDetail, (auditRouteDetail) => auditRouteDetail.auditRoute)
	auditRouteDetails: AuditRouteDetail[];

	@OneToMany(() => NoteCredit, (NoteCredit) => NoteCredit.auditRoute)
	notesCredits: NoteCredit[];
}
