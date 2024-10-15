import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RegisterDetail } from './register_detail.entity';
import { CompleteEntity } from 'src/core/common/entity/common.entity';

@Entity({ name: 'registro' })
export class Register extends CompleteEntity {
    @Column({ type: 'varchar', length: 10, name: 'RutaId' })
    routeId: string;

    @Column({ type: 'varchar', length: 10, name: 'GuiaId' })
    guideId: string;

    @Column({ type: 'varchar', name: 'Tipo' })
    type: string;  // RECOGIDA, ENTREGA o TRANSBORDO

    @Column({ type: 'int', name: 'Secuencia' })
    sequence: number;

    @Column({ type: 'date', name: 'FechaMovimiento' })
    movementDate: string;

    @Column({ type: 'time', name: 'HoraMovimiento' })
    movementTime: string;

    @Column({ type: 'int', name: 'Planeador' })
    planner: number;

    @Column({ type: 'varchar', length: 50, name: 'Zona' })
    zone: string;

    @Column({ type: 'varchar', length: 50, name: 'Ciudad' })
    city: string;

    @Column({ type: 'varchar', length: 50, name: 'Depto' })
    department: string;

    @Column({ type: 'varchar', length: 10, name: 'Placa' })
    licensePlate: string;

    @Column({ type: 'varchar', length: 100, name: 'Conductor' })
    driver: string;

    @Column({ type: 'varchar', length: 100, name: 'NombreSitio' })
    siteName: string;

    @Column({ type: 'varchar', length: 100, name: 'Direccion' })
    address: string;

    @Column({ type: 'varchar', length: 15, name: 'GpsPosicion' })
    gpsPosition: string;

    @Column({ type: 'int', name: 'CantidadTotal' })
    totalQuantity: number;

    @Column({ type: 'varchar', length: 50, name: 'DocReferencia1' })
    referenceDocument: string;

    @Column({ type: 'varchar', length: 50, nullable: true, name: 'DocReferencia2' })
    referenceDocument2: string;

    @Column({ type: 'simple-array', name: 'SoportesURL' })
    supportUrls: string[];

    @OneToMany(() => RegisterDetail, detail => detail.travelRecord, { cascade: true })
    details: RegisterDetail[];
}
