import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Reception } from "src/modules/receptions/entities/reception.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { AuditGuideDetail } from "./audit_guide_detail.entity";
import { AuditGuideRoute } from "./audit_guide-ruta.entity";

@Entity({ name: 'auditoria_guia' })
export class AuditGuide extends CompleteEntity {
	@OneToOne(() => Reception, reception => reception.auditGuide)
	@JoinColumn({ name: 'RecepcionId' })
	reception: Reception;

	@ApiProperty({ description: 'Número de guía' })
	@Column({ type: 'varchar', length: 20, name: 'NumeroGuia' })
	guideNumber: string;

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

	@ApiProperty({ description: 'Estado de la auditoria' })
	@Column({ type: 'bigint', name: 'EstadoAuditoriaId' })
	requestStatusId: number;

	@ApiProperty({ description: 'A Favor Recuperadora' })
	@Column({ type: 'boolean', name: 'AFavorRecuperadora', nullable: true, default: null })
	inFavorRecuperator: boolean;

	@ApiProperty({ description: 'Comentario' })
	@Column({ type: 'varchar', length: 100, name: 'Comentario', default: null, nullable: true })
	comment: string;

	@OneToMany(() => AuditGuideDetail, (auditGuideDetail) => auditGuideDetail.auditGuide)
	auditGuideDetails: AuditGuideDetail[];

	@ApiProperty({ description: 'Auditorias Guias' })
	@OneToMany(() => AuditGuideRoute, auditGuideRoute => auditGuideRoute.auditGuide)
	auditsGuidesRoutes: AuditGuideRoute[];
}
