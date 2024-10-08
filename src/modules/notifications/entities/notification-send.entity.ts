import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'notificacion_enviada' })
export class NotificationSend extends CompleteEntity {
	@ApiProperty({ description: 'name' })
	@Column({ type: 'varchar', length: 255, name: 'Nombre' })
	name: string;

	@ApiProperty({ description: 'subject' })
	@Column({ type: 'varchar', length: 255, name: 'Asunto' })
	subject: string;

	@ApiProperty({ description: 'body' })
	@Column({ type: 'varchar', length: 400, name: 'Cuerpo' })
	body: string;

	@ApiProperty({ description: 'addressee' })
	@Column({ type: 'varchar', length: 500, name: 'Destinatario' })
	addressee: string;
}
