import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CompleteEntity } from 'src/core/common/entity/common.entity';
import { TransporterTravel } from './transporter_travel.entity';

@Entity({ name: 'transportadora_viaje_producto' })
export class TransporterTravelDetail extends CompleteEntity {
    @ManyToOne(() => TransporterTravel, record => record.details)
	@JoinColumn({ name: 'TransportadoraViajeId' })
    travelRecord: TransporterTravel;

    @Column({ type: 'varchar', length: 50, name: 'TipoBateria', nullable: true, default: null })
    batteryType: string;

    @Column({ type: 'int', name: 'Cantidad', nullable: true })
    quantity: number;

	@Column({ type: 'int', name: 'CantidadConciliada', nullable: true })
	quantityConciliated: number;
}
