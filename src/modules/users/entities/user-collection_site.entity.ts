import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { CollectionSite } from 'src/modules/collection_sites/entities/collection_site.entity';

@Entity('usuario_sedes_acopio')
export class UserCollectionSite {
	@PrimaryColumn({ type: 'bigint', name: 'UsuarioId' })
	userId: string;

	@PrimaryColumn({ type: 'bigint', name: 'RolId' })
	collectionSiteId: string;

	@ManyToOne(() => User, user => user.roles)
	@JoinColumn({ name: 'UsuarioId' })
	user: User;

	@ManyToOne(() => CollectionSite, collectionSite => collectionSite.users)
	@JoinColumn({ name: 'SedeAcopioId' })
	collectionSite: CollectionSite;

	@ApiHideProperty()
	@Exclude()
	@Column({ update: false, comment: 'Creador', type: 'bigint', nullable: true, name: 'CreadoPor' })
	createdBy: string;

	@ApiHideProperty()
	@Exclude()
	@Column({ comment: 'Actualizador', type: 'bigint', nullable: true, name: 'ModificadoPor' })
	@IsOptional()
	updatedBy: string;

	@ApiHideProperty()
	@CreateDateColumn({
		nullable: true,
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		name: 'FechaCreacion'
	})
	createdAt: Date;

	@ApiHideProperty()
	@UpdateDateColumn({
		nullable: true,
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)',
		name: 'FechaModificado'
	})
	updatedAt: Date;
}
