import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'usuario' })
export class User extends CompleteEntity {
	@Column({ unique: true, type: 'bigint', default: null, nullable: true })
	OauthId: string;

	@Column({ type: 'varchar', length: 50 })
	Nombre: string;

	@Column({ type: 'varchar', length: 255 })
	Descripcion: string;

	@Column({ type: 'varchar', length: 255 })
	Email: string;
}
