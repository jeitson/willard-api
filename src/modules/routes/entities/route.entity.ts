import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { CollectionRequest } from "src/modules/collection_request/entities/collection_request.entity";
import { Column, Entity, OneToOne, JoinColumn } from "typeorm";

@Entity({ name: 'ruta' })
export class Route extends CompleteEntity {
    @OneToOne(() => CollectionRequest, request => request.route)
    @JoinColumn({ name: 'SolicitudRecogidaId' })
    collectionRequest: CollectionRequest;

    @ApiProperty({ description: 'Route Status ID' })
    @Column({ type: 'bigint', name: 'EstadoRutaId' })
    routeStatusId: number;

    @ApiProperty({ description: 'Name' })
    @Column({ type: 'varchar', length: 100, name: 'Nombre' })
    name: string;

    @ApiProperty({ description: 'Description' })
    @Column({ type: 'varchar', length: 255, nullable: true, name: 'Descripcion' })
    description: string;

    @ApiProperty({ description: 'Confirmed Pickup Date' })
    @Column({ type: 'date', name: 'FechaConfirmadaRecogida' })
    confirmedPickUpDate: string;

    @ApiProperty({ description: 'Trip Opening Date' })
    @Column({ type: 'date', name: 'FechaAperturaViaje', nullable: true, default: null })
    tripStartDate: string;

    @ApiProperty({ description: 'Trip Opening Time' })
    @Column({ type: 'time', name: 'HoraAperturaViaje', nullable: true, default: null })
    tripStartTime: string;

    @ApiProperty({ description: 'Trip Closing Date' })
    @Column({ type: 'date', name: 'FechaCierreViaje', nullable: true, default: null })
    tripEndDate: string;

    @ApiProperty({ description: 'Trip Closing Time' })
    @Column({ type: 'time', name: 'HoraCierreViaje', nullable: true, default: null })
    tripEndTime: string;

    @ApiProperty({ description: 'Truck Plate' })
    @Column({ type: 'varchar', length: 20, name: 'Placa' })
    plate: string;

    @ApiProperty({ description: 'Truck Type ID' })
    @Column({ type: 'bigint', name: 'TipoCamionId' })
    truckTypeId: number;

	@ApiProperty({ description: 'Fecha de entrega en el sitio de acopio' })
    @Column({ type: 'date', name: 'FechaEntregaSitioAcopio', nullable: true })
    deliveryDateToCollectionSite: string;
}
