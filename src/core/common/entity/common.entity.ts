import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

export abstract class CommonEntity extends BaseEntity {
	@ApiProperty()
	@Expose()
	@PrimaryGeneratedColumn({ type: 'bigint', name: 'Id' })
	id: any;

	@ApiProperty()
	@Expose()
	@CreateDateColumn({
		nullable: true,
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		name: 'FechaCreacion',
	})
	createdAt: Date;

	@ApiProperty()
	@Expose()
	@UpdateDateColumn({
		nullable: true,
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)',
		name: 'FechaModificado',
	})
	updatedAt: Date;

	@ApiProperty({ description: 'Estado' })
	@Expose()
	@Column({ comment: 'Estado', default: true, name: 'Estado' })
	status: boolean;
}

export abstract class CompleteEntity extends CommonEntity {
	@ApiProperty()
	@Exclude()
	@Column({ update: false, comment: 'Creador', type: 'bigint', nullable: true, name: 'CreadoPor' })
	createdBy: string;

	@ApiProperty()
	@Exclude()
	@Column({ comment: 'Actualizador', type: 'bigint', nullable: true, name: 'ModificadoPor' })
	@IsOptional()
	modifiedBy: string;
}
