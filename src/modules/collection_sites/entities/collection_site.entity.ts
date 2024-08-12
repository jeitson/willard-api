import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'sedes_acopio' })
export class CollectionSite extends CompleteEntity {
	@Column({ type: 'bigint', name: 'TipoSedeId' })
	siteTypeId: number;

	@Column({ type: 'bigint', name: 'PaisId' })
	countryId: number;

	@Column({ type: 'bigint', name: 'CiudadId' })
	cityId: number;

	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Descripcion' })
	description: string;

	@Column({ type: 'varchar', length: 20, name: 'Nit' })
	taxId: string;

	@Column({ type: 'varchar', length: 255, name: 'RazonSocial' })
	businessName: string;

	@Column({ type: 'varchar', length: 100, name: 'Barrio' })
	neighborhood: string;

	@Column({ type: 'varchar', length: 100, name: 'Direccion' })
	address: string;

	@Column({ type: 'varchar', length: 100, nullable: true, default: null, name: 'Latitud' })
	latitude: string;

	@Column({ type: 'varchar', length: 100, nullable: true, default: null, name: 'Longitud' })
	longitude: string;

	@Column({ type: 'varchar', length: 100, name: 'NombreContacto' })
	contactName: string;

	@Column({ type: 'varchar', length: 100, name: 'EmailContacto' })
	contactEmail: string;

	@Column({ type: 'varchar', length: 100, name: 'CelContacto' })
	contactPhone: string;

	@Column({ type: 'varchar', length: 255, name: 'ReferenciaWLL' })
	referenceWLL: string;

	@Column({ type: 'varchar', length: 255, name: 'ReferenciaPH' })
	referencePH: string;
}
