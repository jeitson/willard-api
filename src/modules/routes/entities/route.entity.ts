import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { CollectionRequest } from "src/modules/collection_request/entities/collection_request.entity";
import { Column, Entity, OneToOne, JoinColumn } from "typeorm";

@Entity({ name: 'ruta' })
export class Route extends CompleteEntity {
    @ApiProperty({ description: 'Collection Request' })
    @OneToOne(() => CollectionRequest, request => request.route)
    @JoinColumn({ name: 'SolicitudRecogidaId' })
    collectionRequest: CollectionRequest;

    @ApiProperty({ description: 'Route Status ID' })
    @Column({ type: 'bigint', name: 'EstadoRutaId' })
    routeStatusId: bigint;

    @ApiProperty({ description: 'Name' })
    @Column({ type: 'varchar', length: 100, name: 'Nombre' })
    name: string;

    @ApiProperty({ description: 'Description' })
    @Column({ type: 'varchar', length: 255, nullable: true, name: 'Descripcion' })
    description: string;

    @ApiProperty({ description: 'Confirmed Pickup Date' })
    @Column({ type: 'date', name: 'FechaConfirmadaRecogida' })
    confirmedPickupDate: Date;

    @ApiProperty({ description: 'Trip Opening Date' })
    @Column({ type: 'date', name: 'FechaAperturaViaje' })
    tripOpeningDate: Date;

    @ApiProperty({ description: 'Trip Opening Time' })
    @Column({ type: 'time', name: 'HoraAperturaViaje' })
    tripOpeningTime: string;

    @ApiProperty({ description: 'Trip Closing Date' })
    @Column({ type: 'date', name: 'FechaCierreViaje', nullable: true })
    tripClosingDate: Date;

    @ApiProperty({ description: 'Trip Closing Time' })
    @Column({ type: 'time', name: 'HoraCierreViaje', nullable: true })
    tripClosingTime: string;

    @ApiProperty({ description: 'Truck Plate' })
    @Column({ type: 'varchar', length: 20, name: 'Placa' })
    plate: string;

    @ApiProperty({ description: 'Truck Type ID' })
    @Column({ type: 'bigint', name: 'TipoCamionId' })
    truckTypeId: bigint;

    @Column({ type: 'date', name: 'FechaEntregaSitioAcopio', nullable: true })
    deliveryDateToCollectionSite: Date;
}
