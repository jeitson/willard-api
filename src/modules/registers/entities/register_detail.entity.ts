import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Register } from './register.entity';
import { CompleteEntity } from 'src/core/common/entity/common.entity';

@Entity({ name: 'registro_detalle' })
export class RegisterDetail extends CompleteEntity {
    @ManyToOne(() => Register, record => record.details)
    travelRecord: Register;

    @Column({ type: 'varchar', length: 10, name: 'TipoBat' })
    batteryType: string;

    @Column({ type: 'int', name: 'Cantidades' })
    quantities: number;
}
