import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Role } from '../../roles/entities/rol.entity';
import { data } from './data';

@Injectable()
export class RolesSeeder {
	constructor(private readonly dataSource: DataSource) { }

	async run() {
		const roleRepository = this.dataSource.getRepository(Role);

		for (const role of data) {
			const exists = await roleRepository.findOneBy({ id: role.id });
			if (!exists) {
				const newRole = roleRepository.create({ ...role, menu: JSON.stringify(role.menu) });
				await roleRepository.save(newRole);
			}
		}

		console.log('Roles seeded successfully');
	}
}
