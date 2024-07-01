import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryEntity } from 'src/modules/system/country/entities/country.entity';
import { Repository } from 'typeorm';

import countries from 'src/resources/country';

@Injectable()
export class SeederService {
	constructor(
		@InjectRepository(CountryEntity)
		private readonly countryRepository: Repository<CountryEntity>,
	) {}

	async seedInitialData(): Promise<void> {
		await Promise.all(
			countries.map(async (countryData) => {
				const country = this.countryRepository.create(countryData);
				await this.countryRepository.save(country);
			}),
		);
	}
}
