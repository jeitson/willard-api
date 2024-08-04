import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'sedes_acopio' })
export class CollectionSite extends CompleteEntity {
	@Column({ type: 'bigint' })
	TipoSedeId: number;

	@Column({ type: 'bigint' })
	PaisId: number;

	@Column({ type: 'bigint' })
	CiudadId: number;

	@Column({ type: 'varchar', length: 50 })
	Nombre: string;

	@Column({ type: 'varchar', length: 255, nullable: true, default: null })
	Descripcion: string;

	@Column({ type: 'varchar', length: 20 })
	Nit: string;

	@Column({ type: 'varchar', length: 255 })
	RazonSocial: string;

	@Column({ type: 'varchar', length: 100 })
	Barrio: string;

	@Column({ type: 'varchar', length: 100 })
	Direccion: string;

	@Column({ type: 'varchar', length: 100, nullable: true, default: null })
	Latitud: string;

	@Column({ type: 'varchar', length: 100, nullable: true, default: null })
	Longitud: string;

	@Column({ type: 'varchar', length: 100 })
	NombreContacto: string;

	@Column({ type: 'varchar', length: 100 })
	EmailContacto: string;

	@Column({ type: 'varchar', length: 100 })
	CelContacto: string;

	@Column({ type: 'varchar', length: 255 })
	ReferenciaWLL: string;

	@Column({ type: 'varchar', length: 255 })
	ReferenciaPH: string;
}
