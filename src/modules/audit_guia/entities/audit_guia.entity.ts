import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Reception } from "src/modules/receptions/entities/reception.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { AuditGuiaDetail } from "./audit_guia_detail.entity";
import { AuditGuiaRoute } from "./audit_guia-ruta.entity";

@Entity({ name: 'auditoria_guia' })
export class AuditGuia extends CompleteEntity {
	@OneToOne(() => Reception, reception => reception.auditGuia)
	@JoinColumn({ name: 'RecepcionId' })
	reception: Reception;

	@ApiProperty({ description: 'Número de guía' })
	@Column({ type: 'varchar', length: 20, name: 'NumeroGuia' })
	guideNumber: string;

	@ApiProperty({ description: 'Fecha' })
	@Column({ type: 'varchar', length: 20, name: 'Fecha' })
	date: string;

	@ApiProperty({ description: 'Zona ID' })
	@Column({ type: 'bigint', name: 'ZonaId' })
	zoneId: number;

	@ApiProperty({ description: 'Recuperadora ID' })
	@Column({ type: 'bigint', name: 'RecuperadoraId' })
	recuperatorId: number;

	@ApiProperty({ description: 'Transportadora ID' })
	@Column({ type: 'bigint', name: 'TransportadoraId' })
	transporterId: number;

	@ApiProperty({ description: 'Recuperadora Total' })
	@Column({ type: 'int', name: 'RecuperadoraTotal' })
	recuperatorTotal: number;

	@ApiProperty({ description: 'Transportadora Total' })
	@Column({ type: 'int', name: 'TransportadoraTotal' })
	transporterTotal: number;

	@ApiProperty({ description: 'Estado de la auditoria' })
	@Column({ type: 'bigint', name: 'EstadoAuditoriaId' })
	requestStatusId: number;

	@ApiProperty({ description: 'A Favor Recuperadora' })
	@Column({ type: 'boolean', name: 'AFavorRecuperadora', nullable: true, default: null })
	inFavorRecuperator: boolean;

	@ApiProperty({ description: 'Comentario' })
	@Column({ type: 'varchar', length: 100, name: 'Comentario', default: null, nullable: true })
	comment: string;

	@OneToMany(() => AuditGuiaDetail, (auditGuiaDetail) => auditGuiaDetail.auditGuia)
	auditGuiaDetails: AuditGuiaDetail[];

	@ApiProperty({ description: 'Auditorias Guias' })
	@OneToMany(() => AuditGuiaRoute, auditGuiaRoute => auditGuiaRoute.auditGuia)
	auditsGuiasRoutes: AuditGuiaRoute[];
}
