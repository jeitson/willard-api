import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import config from './core/config';
import { SharedModule } from './core/shared/shared.module';
import { DatabaseModule } from './core/shared/database/database.module';
import { AllExceptionsFilter } from './core/filters/any-exception.filter';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuditsModule } from './modules/audits/audits.module';
import { CatalogsModule } from './modules/catalogs/catalogs.module';
import { CollectionSitesModule } from './modules/collection_sites/collection_sites.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ProductsModule } from './modules/products/products.module';
import { TransportersModule } from './modules/transporters/transporters.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true,
			// Cuando se especifican varios archivos env, el primero tiene la prioridad más alta.
			envFilePath: ['.env'],
			load: [...Object.values(config)],
		}),
		SharedModule,
		DatabaseModule,
		UsersModule,
		RolesModule,
		AuditsModule,
		CatalogsModule,
		CollectionSitesModule,
		ClientsModule,
		ProductsModule,
		TransportersModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule { }
