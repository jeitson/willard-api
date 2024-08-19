import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'sedes_acopio' })
export class CollectionSite extends CompleteEntity {
	@ApiProperty({ description: 'siteTypeId' })
	@Column({ type: 'bigint', name: 'TipoSedeId' })
	siteTypeId: number;

	@ApiProperty({ description: 'cityId' })
	@Column({ type: 'bigint', name: 'CiudadId' })
	cityId: number;

	@ApiProperty({ description: 'name' })
	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'description' })
	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Descripcion' })
	description: string;

	@ApiProperty({ description: 'nit' })
	@Column({ type: 'varchar', length: 20, name: 'Nit' })
	nit: string;

	@ApiProperty({ description: 'businessName' })
	@Column({ type: 'varchar', length: 255, name: 'RazonSocial' })
	businessName: string;

	@ApiProperty({ description: 'neighborhood' })
	@Column({ type: 'varchar', length: 100, name: 'Barrio' })
	neighborhood: string;

	@ApiProperty({ description: 'address' })
	@Column({ type: 'varchar', length: 100, name: 'Direccion' })
	address: string;

	@ApiProperty({ description: 'latitude' })
	@Column({ type: 'varchar', length: 100, nullable: true, default: null, name: 'Latitud' })
	latitude: string;

	@ApiProperty({ description: 'longitude' })
	@Column({ type: 'varchar', length: 100, nullable: true, default: null, name: 'Longitud' })
	longitude: string;

	@ApiProperty({ description: 'contactName' })
	@Column({ type: 'varchar', length: 100, name: 'NombreContacto' })
	contactName: string;

	@ApiProperty({ description: 'contactEmail' })
	@Column({ type: 'varchar', length: 100, name: 'EmailContacto' })
	contactEmail: string;

	@ApiProperty({ description: 'contactPhone' })
	@Column({ type: 'varchar', length: 100, name: 'CelContacto' })
	contactPhone: string;

	@ApiProperty({ description: 'referenceWLL' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaWLL' })
	referenceWLL: string;

	@ApiProperty({ description: 'referencePH' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaPH' })
	referencePH: string;
}
