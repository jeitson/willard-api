import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { CollectionRequest } from "src/modules/collection_request/entities/collection_request.entity";
import { PickUpLocation } from "src/modules/pick_up_location/entities/pick_up_location.entity";
import { ReportsPh } from "src/modules/reports_ph/entities/reports_ph.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Branch } from "./client_branch.entity";

@Entity({ name: 'cliente' })
export class Client extends CompleteEntity {
	@ApiProperty({ description: 'name' })
	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'description' })
	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Descripcion' })
	description: string;

	@ApiProperty({ description: 'businessName' })
	@Column({ type: 'varchar', length: 255, name: 'RazonSocial' })
	businessName: string;

	@ApiProperty({ description: 'documentTypeId' })
	@Column({ type: 'bigint', name: 'TipoDocumentoId' })
	documentTypeId: number;

	@ApiProperty({ description: 'countryId' })
	@Column({ type: 'bigint', name: 'PaisId', nullable: true, default: null })
	countryId: number;

	@ApiProperty({ description: 'documentNumber' })
	@Column({ type: 'varchar', length: 50, name: 'NumeroDocumento' })
	documentNumber: string;

	@ApiProperty({ description: 'referenceWLL' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaWLL', nullable: true, default: null })
	referenceWLL: string;

	@ApiProperty({ description: 'referencePH' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaPH', nullable: true, default: null })
	referencePH: string;

	@OneToMany(() => PickUpLocation, pickUpLocation => pickUpLocation.client)
    pickUpLocations: PickUpLocation[];

	@OneToMany(() => CollectionRequest, collectionsRequests => collectionsRequests.client)
    collectionsRequests: CollectionRequest[];

	@OneToMany(() => Branch, branch => branch.client)
    branchs: Branch[];

	// @OneToMany(() => ReportsPh, reportsPh => reportsPh.client)
    reportsPh: ReportsPh[];
}
