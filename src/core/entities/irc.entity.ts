import { ApiProperty } from "@nestjs/swagger";
import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'irc' })
export class Irc extends CompleteEntity {
	@ApiProperty({ description: 'Radicado' })
    @Column({ type: 'varchar', length: 50, name: 'Radicado' })
    residing: string;

    @ApiProperty({ description: 'IrcId' })
    @Column({
        type: 'varchar',
        length: 50,
        default: null,
        nullable: true,
        name: 'IrcId',
        unique: true
    })
    ircId: string;

	@ApiProperty({ description: 'Guia' })
	@Column({ type: 'varchar', length: 25, default: null, nullable: true, name: 'Guia' })
	guide: string;

	@ApiProperty({ description: 'Agencia' })
	@Column({ type: 'varchar', length: 25, default: null, nullable: true, name: 'Agencia' })
	agency: string;

	@ApiProperty({ description: 'Cliente' })
	@Column({ type: 'varchar', length: 50, default: null, nullable: true, name: 'Cliente' })
	client: string;

	@ApiProperty({ description: 'Fecha' })
	@Column({ type: 'varchar', length: 100, default: null, nullable: true, name: 'Fecha' })
	date: string;

	@ApiProperty({ description: 'RecibidoPor' })
	@Column({ type: 'varchar', length: 50, default: null, nullable: true, name: 'RecibidoPor' })
	receivedBy: string;

	@ApiProperty({ description: 'Observacion' })
	@Column({ type: 'varchar', length: 100, default: null, nullable: true, name: 'Observacion' })
	observation: string;
}
