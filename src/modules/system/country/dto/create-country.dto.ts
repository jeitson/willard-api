import { Continent } from '../entities/country.entity';

export class CreateCountryDto {
	code: string;
	name: string;
	continent: Continent;
	region: string;
	surface_area: number;
	indep_year?: number;
	population: number;
	life_expectancy?: number;
	gnp?: number;
	gnp_old?: number;
	local_name: string;
	government_form: string;
	head_of_state: string;
	capital?: number;
	code_2: number;
}
