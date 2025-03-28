import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { CollectionSite } from 'src/modules/collection_sites/entities/collection_site.entity';
import { CompleteEntity } from 'src/core/common/entity/common.entity';

@Entity({ name: 'usuario_sedes_acopio' })
export class UserCollectionSite extends CompleteEntity {

	@PrimaryColumn({ type: 'bigint', name: 'UsuarioId' })
	userId: number;

	@PrimaryColumn({ type: 'bigint', name: 'SedeAcopioId' })
	collectionSiteId: number;

	@ManyToOne(() => User, user => user.userCollectionSites)
	@JoinColumn({ name: 'UsuarioId' })
	user: User;

	@ManyToOne(() => CollectionSite, collectionSite => collectionSite.userCollectionSites)
	@JoinColumn({ name: 'SedeAcopioId' })
	collectionSite: CollectionSite;
}
