import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { PickUpLocation } from "src/modules/pick_up_location/entities/pick_up_location.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({ name: 'asesor' })
export class Consultant extends CompleteEntity {
	@ApiProperty({ description: 'name' })
	@Column({ type: 'varchar', length: 50, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'email' })
	@Column({ type: 'varchar', length: 100, name: 'Email' })
	email: string;

	@ApiProperty({ description: 'phone' })
	@Column({ type: 'varchar', length: 100, name: 'Cel' })
	phone: string;

	@ApiProperty({ description: 'description' })
	@Column({ type: 'varchar', length: 255, nullable: true, default: null, name: 'Descripcion' })
	description: string;

	@ApiProperty({ description: 'referencePH' })
	@Column({ type: 'varchar', length: 255, name: 'ReferenciaPH' })
	referencePH: string;

	@OneToMany(() => PickUpLocation, pickUpLocation => pickUpLocation.consultant)
    pickUpLocations: PickUpLocation[];
}
