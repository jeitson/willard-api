import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Irc } from "./irc.entity";

@Entity({ name: 'item' })
export class Item extends CompleteEntity {
	@Column({
		type: 'varchar',
		length: 50,
		name: 'IrcId'
	})
	ircId: string;

	@Column({
		type: 'varchar',
		length: 50,
		name: 'Referencia'
	})
	reference: string;
	@Index(['ircId', 'referencia'], { unique: true })
	@Column({ type: 'int', name: 'Cantidad' })
	quantity: string;

	@ApiProperty({ description: 'OtroTipoDocumento' })
	@Column({ type: 'varchar', length: 25, default: null, nullable: true, name: 'OtroTipoDocumento' })
	otherDocumentType: string;

	@ApiProperty({ description: 'OtroNumeroDocumento' })
	@Column({ type: 'varchar', length: 25, default: null, nullable: true, name: 'OtroNumeroDocumento' })
	otherDocumentNumber: string;

	@ManyToOne(() => Irc, (irc) => irc.items)
	@JoinColumn({ name: 'IrcIdRef' })
	irc: Irc;
}
