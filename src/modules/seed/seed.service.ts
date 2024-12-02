import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersSeeder } from './users/service';
import { RolesSeeder } from './roles/service';
import { CatalogsSeeder } from './catalogs/service';

@Injectable()
export class SeedService implements OnModuleInit {
	constructor(
		private readonly usersSeeder: UsersSeeder,
		private readonly rolesSeeder: RolesSeeder,
		private readonly catalogsSeeder: CatalogsSeeder
	) { }

	async onModuleInit() {
		await this.runSeed();
	}

	async runSeed() {
		console.log('Running seed data...');

		await this.usersSeeder.run();
		await this.rolesSeeder.run();
		await this.catalogsSeeder.run();

		console.log('Seed data completed.');
	}
}
