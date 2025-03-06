import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { AuditRoute } from "src/modules/audit_route/entities/audit_route.entity";
import { CollectionRequest } from "src/modules/collection_request/entities/collection_request.entity";
import { TransporterTravel } from "src/modules/transporter_travel/entities/transporter_travel.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({ name: 'transportadora' })
export class Transporter extends CompleteEntity {
	@ApiProperty({ description: 'name' })
	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'taxId' })
	@Column({ type: 'varchar', length: 20, name: 'Nit' })
	taxId: string;

	@ApiProperty({ description: 'businessName' })
	@Column({ type: 'varchar', length: 255, name: 'RazonSocial' })
	businessName: string;

	@ApiProperty({ description: 'description' })
	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Descripcion' })
	description: string;

	@ApiProperty({ description: 'contactName' })
	@Column({ type: 'varchar', length: 100, name: 'NombreContacto' })
	contactName: string;

	@ApiProperty({ description: 'contactEmail' })
	@Column({ type: 'varchar', length: 100, name: 'EmailContacto' })
	contactEmail: string;

	@ApiProperty({ description: 'referenceWLL' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaWLL' })
	referenceWLL: string;

	@ApiProperty({ description: 'referencePH' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaPH' })
	referencePH: string;

	@OneToMany(() => CollectionRequest, (collectionsRequests) => collectionsRequests.transporter)
	collectionsRequests: () => CollectionRequest[]; // Lazy resolver

	@OneToMany(() => TransporterTravel, (transporterTravel) => transporterTravel.transporter)
	transporterTravels: () => TransporterTravel[]; // Lazy resolver

	@OneToMany(() => User, (user) => user.transporter)
	users: () => User[]; // Lazy resolver

	@OneToMany(() => AuditRoute, (auditRoute) => auditRoute.transporter)
	auditRoutes: () => AuditRoute[]; // Lazy resolver
}
