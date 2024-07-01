import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from './entities/country.entity';

const providers = [CountryService];

@Module({
	imports: [TypeOrmModule.forFeature([CountryEntity])],
	controllers: [CountryController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class CountryModule {}
