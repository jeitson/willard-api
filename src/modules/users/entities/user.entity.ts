import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { UserRole } from "./user-rol.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from 'class-transformer';
import { PickUpLocation } from "src/modules/pick_up_location/entities/pick_up_location.entity";
import { CollectionRequest } from "src/modules/collection_request/entities/collection_request.entity";
import { UserCollectionSite } from "./user-collection_site.entity";
import { UserZone } from "./user-zone.entity";
import { Transporter } from "src/modules/transporters/entities/transporter.entity";
import { AuditRoute } from "src/modules/audit_route/entities/audit_route.entity";
import { CollectionSite } from "src/modules/collection_sites/entities/collection_site.entity";

@Entity({ name: 'usuario' })
export class User extends CompleteEntity {
	@ApiProperty({ description: 'oauthId' })
	@Column({ unique: true, type: 'varchar', length: 255, default: null, nullable: true, name: 'OauthId' })
	oauthId: string;

	@ApiProperty({ description: 'name' })
	@Column({ type: 'varchar', length: 50, name: 'Nombre', default: null, nullable: true })
	name: string;

	@ApiProperty({ description: 'description' })
	@Column({ type: 'varchar', length: 255, default: null, nullable: true, name: 'Descripcion' })
	description: string;

	@ApiProperty({ description: 'email' })
	@Column({ type: 'varchar', length: 255, name: 'Email' })
	email: string;

	@ApiProperty({ description: 'cellphone' })
	@Column({ type: 'varchar', length: 10, name: 'Celular', default: null, nullable: true })
	cellphone: string;

	@ApiProperty({ description: 'referencePH' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaPH', default: null, nullable: true })
	referencePH: string = null;

	@ApiProperty({ description: 'referenceWLL' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaWLL', default: null, nullable: true })
	referenceWLL: string = null;

	@ApiProperty({ description: 'roles' })
	@OneToMany(() => UserRole, userRole => userRole.user)
	roles: UserRole[];

	@ApiProperty({ description: 'Sedes de acopio asociadas a este usuario' })
	@OneToMany(() => UserCollectionSite, userCollectionSite => userCollectionSite.user)
    userCollectionSites: UserCollectionSite[];

	@ApiProperty({ description: 'zones' })
	@OneToMany(() => UserZone, userZone => userZone.user)
	zones: UserZone[];

	@OneToMany(() => PickUpLocation, (pickUpLocation) => pickUpLocation.user)
	pickUpLocations: PickUpLocation[];

	@OneToMany(() => CollectionRequest, (collectionsRequests) => collectionsRequests.user)
	collectionsRequests: CollectionRequest[];

	@ManyToOne(() => Transporter, transporter => transporter.users)
	@JoinColumn({ name: 'TransportadoraId' })
	transporter: Transporter;
}
