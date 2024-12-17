import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { AuditGuide } from './audit_guide.entity';
import { TransporterTravel } from 'src/modules/transporter_travel/entities/transporter_travel.entity';

@Entity('auditoria_guia_ruta')
export class AuditGuideRoute {
	@PrimaryColumn({ type: 'bigint', name: 'AuditoriaGuiaId' })
	auditGuideId: string;

	@PrimaryColumn({ type: 'bigint', name: 'TransportadoraViajeId' })
	transporterTravelId: string;

	@ManyToOne(() => AuditGuide, auditGuide => auditGuide.auditsGuidesRoutes)
	@JoinColumn({ name: 'AuditoriaGuiaId' })
	auditGuide: AuditGuide;

	@ManyToOne(() => TransporterTravel, transporterTravel => transporterTravel.transportersTravels)
	@JoinColumn({ name: 'TransportadoraViajeId' })
	transporterTravel: TransporterTravel;

	@ApiHideProperty()
	@Exclude()
	@Column({ update: false, comment: 'Creador', type: 'bigint', nullable: true, name: 'CreadoPor' })
	createdBy: string;

	@ApiHideProperty()
	@Exclude()
	@Column({ comment: 'Actualizador', type: 'bigint', nullable: true, name: 'ModificadoPor' })
	@IsOptional()
	updatedBy: string;

	@ApiHideProperty()
	@CreateDateColumn({
		nullable: true,
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		name: 'FechaCreacion'
	})
	createdAt: Date;

	@ApiHideProperty()
	@UpdateDateColumn({
		nullable: true,
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)',
		name: 'FechaModificado'
	})
	updatedAt: Date;
}
