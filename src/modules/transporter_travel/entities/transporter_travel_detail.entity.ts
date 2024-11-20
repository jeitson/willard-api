import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CompleteEntity } from 'src/core/common/entity/common.entity';
import { TransporterTravel } from './transporter_travel.entity';

@Entity({ name: 'TransportadoraViajeProducto' })
export class TransporterTravelDetail extends CompleteEntity {
    @ManyToOne(() => TransporterTravel, record => record.details)
	@JoinColumn({ name: 'TransportadoraViajeId' })
    travelRecord: TransporterTravel;

    @Column({ type: 'varchar', length: 10, name: 'TipoBateria' })
    batteryType: string;

    @Column({ type: 'int', name: 'Cantidad' })
    quantity: number;
}
