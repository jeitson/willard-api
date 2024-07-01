import { CommonEntity } from 'src/core/common/entity/common.entity';
import { Column, Entity } from 'typeorm';

export enum Continent {
	Asia = 'Asia',
	Europe = 'Europe',
	'North America' = 'North America',
	Africa = 'Africa',
	Oceania = 'Oceania',
	Antarctica = 'Antarctica',
	'South America' = 'South America',
}

@Entity({ name: 'sys_country' })
export class CountryEntity extends CommonEntity {
	@Column({ unique: true, type: 'char', nullable: false, length: 3 })
	// @Index()
	code: string;

	@Column({ type: 'char', nullable: false, length: 52 })
	name: string;

	@Column({ type: 'enum', nullable: false, enum: Continent })
	continent: Continent;

	@Column({ type: 'varchar', nullable: false })
	region: string;

	@Column({ type: 'decimal', nullable: false, precision: 10, scale: 2 })
	surface_area: string;

	@Column({ type: 'smallint', nullable: true })
	indep_year?: string;

	@Column({ type: 'int', nullable: false, default: 0 })
	population: string;

	@Column({ type: 'decimal', nullable: true, precision: 3, scale: 1 })
	life_expectancy?: string;

	@Column({ type: 'decimal', nullable: true, precision: 10, scale: 2 })
	gnp?: string;

	@Column({ type: 'decimal', nullable: true, precision: 10, scale: 2 })
	gnp_old?: string;

	@Column({ type: 'char', nullable: false, length: 45 })
	local_name: string;

	@Column({ type: 'char', nullable: false, length: 45 })
	government_form: string;

	@Column({ type: 'char', nullable: true, length: 60 })
	head_of_state: string;

	@Column({ type: 'int', nullable: true })
	capital?: string;

	@Column({ type: 'char', nullable: false, length: 2 })
	code_2: string;
}
