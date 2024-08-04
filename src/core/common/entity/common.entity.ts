import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

export abstract class CommonEntity extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	Id: number;

	@ApiHideProperty()
	@CreateDateColumn({
		nullable: true,
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
	})
	FechaCreacion: Date;

	@ApiHideProperty()
	@UpdateDateColumn({
		nullable: true,
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)',
	})
	FechaModificado: Date;

	@ApiHideProperty()
	@ApiProperty({ description: 'Estado' })
	@Column({ comment: 'Estado', default: true })
	Estado: boolean;
}

export abstract class CompleteEntity extends CommonEntity {
	@ApiHideProperty()
	@Exclude()
	@Column({ update: false, comment: 'Creador', type: 'bigint', nullable: true })
	CreadoPor: string;

	@ApiHideProperty()
	@Exclude()
	@Column({ comment: 'Actualizador', type: 'bigint', nullable: true })
	@IsOptional()
	ModificadoPor: string;
}
