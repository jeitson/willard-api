import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { CollectionRequest } from "src/modules/collection_request/entities/collection_request.entity";
import { PickUpLocation } from "src/modules/pick_up_location/entities/pick_up_location.entity";
import { ReportsPh } from "src/modules/reports_ph/entities/reports_ph.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToMany, OneToMany } from "typeorm";

@Entity({ name: 'sedes_acopio' })
export class CollectionSite extends CompleteEntity {

	@ApiProperty({ description: 'Tipo de Sede' })
	@Column({ type: 'bigint', name: 'TipoSedeId' })
	siteTypeId: number;

	@ApiProperty({ description: 'Ciudad' })
	@Column({ type: 'bigint', name: 'CiudadId' })
	cityId: number;

	@ApiProperty({ description: 'Nombre' })
	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'Descripción' })
	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Descripcion' })
	description: string;

	@ApiProperty({ description: 'Nit' })
	@Column({ type: 'varchar', length: 20, name: 'Nit' })
	nit: string;

	@ApiProperty({ description: 'Razón Social' })
	@Column({ type: 'varchar', length: 255, name: 'RazonSocial' })
	businessName: string;

	@ApiProperty({ description: 'Barrio' })
	@Column({ type: 'varchar', length: 100, name: 'Barrio' })
	neighborhood: string;

	@ApiProperty({ description: 'Dirección' })
	@Column({ type: 'varchar', length: 100, name: 'Direccion' })
	address: string;

	@ApiProperty({ description: 'Latitud' })
	@Column({ type: 'varchar', length: 100, nullable: true, default: null, name: 'Latitud' })
	latitude: string;

	@ApiProperty({ description: 'Longitud' })
	@Column({ type: 'varchar', length: 100, nullable: true, default: null, name: 'Longitud' })
	longitude: string;

	@ApiProperty({ description: 'Nombre del contacto' })
	@Column({ type: 'varchar', length: 100, name: 'NombreContacto' })
	contactName: string;

	@ApiProperty({ description: 'Email del contacto' })
	@Column({ type: 'varchar', length: 100, name: 'EmailContacto' })
	contactEmail: string;

	@ApiProperty({ description: 'Teléfono del contacto' })
	@Column({ type: 'varchar', length: 100, name: 'CelContacto' })
	contactPhone: string;

	@ApiProperty({ description: 'Referencia WLL' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaWLL' })
	referenceWLL: string;

	@ApiProperty({ description: 'Referencia PH' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaPH' })
	referencePH: string;

	@OneToMany(() => PickUpLocation, pickUpLocation => pickUpLocation.collectionSite)
	pickUpLocations: PickUpLocation[];

	@OneToMany(() => CollectionRequest, collectionsRequests => collectionsRequests.collectionSite)
	collectionsRequests: CollectionRequest[];

	@ManyToMany(() => User, user => user.collectionSites)
	users: User[];

	@OneToMany(() => ReportsPh, reportsPh => reportsPh.collectionSite)
	reportsPh: ReportsPh[];
}
