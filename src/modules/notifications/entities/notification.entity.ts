import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'notificacion' })
export class Notification extends CompleteEntity {
	@ApiProperty({ description: 'name' })
	@Column({ type: 'varchar', length: 255, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'subject' })
	@Column({ type: 'varchar', length: 255, name: 'Asunto' })
	subject: string;

	@ApiProperty({ description: 'template' })
	@Column({ type: 'varchar', length: 400, name: 'Plantilla' })
	template: string;

	@ApiProperty({ description: 'emails' })
	@Column({ type: 'varchar', length: 500, name: 'Correos' })
	emails: string;
}
