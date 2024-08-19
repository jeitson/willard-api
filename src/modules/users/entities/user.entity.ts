import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { UserRole } from "./user-rol.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from 'class-transformer';

@Entity({ name: 'usuario' })
export class User extends CompleteEntity {
	@ApiProperty({ description: 'oauthId' })
	@Column({ unique: true, type: 'bigint', default: null, nullable: true, name: 'OauthId' })
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

	@ApiProperty({ description: 'roles' })
	@OneToMany(() => UserRole, userRole => userRole.user)
	roles: UserRole[];
}
