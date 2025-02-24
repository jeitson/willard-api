import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Reception } from "src/modules/receptions/entities/reception.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { AUDIT_ROUTE_REASON } from "src/core/constants/status.constant";
import { AuditRouteDetail } from "./audit_route_detail.entity";
import { TransporterTravel } from "src/modules/transporter_travel/entities/transporter_travel.entity";

@Entity({ name: 'auditoria_ruta' })
export class AuditRoute extends CompleteEntity {
	@JoinColumn({ name: 'RecepcionId' })
	@ApiProperty({ description: 'ID de recepción (FK)' })
	@ManyToOne(() => Reception, (reception) => reception.auditRoutes)
	reception: Reception;

	@JoinColumn({ name: 'RutaId' })
	@ApiProperty({ description: 'ID de la ruta (FK)' })
	@ManyToOne(() => TransporterTravel, (transporterTravel) => transporterTravel.auditRoutes)
	routeNumber: string;

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
	@Column({ type: 'int', name: 'RecuperadoraTotal' })
	recuperatorTotal: number;

	@ApiProperty({ description: 'Transportadora Total' })
	@Column({ type: 'int', name: 'TransportadoraTotal' })
	transporterTotal: number;

	@ApiProperty({ description: 'Conciliación Total' })
	@Column({ type: 'boolean', name: 'ConciliacionTotal', nullable: true, default: null })
	conciliationTotal: boolean;

	@ApiProperty({ description: 'Estado de la auditoria' })
	@Column({ type: 'bigint', name: 'EstadoId' })
	requestStatusId: number;

	@ApiProperty({ description: 'Comentario' })
	@Column({ type: 'varchar', length: 1000, name: 'Comentario', default: null, nullable: true })
	comment: string;

	@OneToMany(() => AuditRouteDetail, (auditRouteDetail) => auditRouteDetail.auditRoute)
	auditRouteDetails: AuditRouteDetail[];
}
