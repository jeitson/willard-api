import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	VirtualColumn,
} from 'typeorm';

export abstract class CommonEntity extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiHideProperty()
	@CreateDateColumn({
		name: 'created_at',
		nullable: true,
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
	})
	createdAt: Date;
	@ApiHideProperty()
	@UpdateDateColumn({
		name: 'updated_at',
		nullable: true,
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)',
	})
	updatedAt: Date;

	@ApiHideProperty()
	@ApiProperty({ description: 'Estado' })
	@Column({ name: 'status', comment: 'Estado', default: true })
	status: boolean;
}

export abstract class CompleteEntity extends CommonEntity {
	@ApiHideProperty()
	@Exclude()
	@Column({ name: 'create_by', update: false, comment: 'Fundador' })
	createBy: string;

	@ApiHideProperty()
	@Exclude()
	@Column({ name: 'update_by', comment: 'Actualizador' })
	@IsOptional()
	updateBy: string;

	/**
	 * Las columnas virtuales no se guardarán en la base de datos, puede haber problemas de rendimiento cuando el volumen de datos es grande.
	 * @see https://typeorm.io/decorator-reference#virtualcolumn
	 */
	@ApiHideProperty()
	@ApiProperty({ description: 'Fundador' })
	@VirtualColumn({
		query: (alias) =>
			`SELECT username FROM sys_user WHERE id = ${alias}.create_by`,
	})
	creator: string;

	@ApiHideProperty()
	@ApiProperty({ description: 'Actualizador' })
	@VirtualColumn({
		query: (alias) =>
			`SELECT username FROM sys_user WHERE id = ${alias}.update_by`,
	})
	updater: string;
}
