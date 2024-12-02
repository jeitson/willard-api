import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { data } from './data';
import { User } from 'src/modules/users/entities/user.entity';
import { Role } from 'src/modules/roles/entities/rol.entity';

@Injectable()
export class UsersSeeder {
	constructor(private readonly dataSource: DataSource) { }

	async run() {
		const userRepository = this.dataSource.getRepository(User);
		const roleRepository = this.dataSource.getRepository(Role);

		for (let { name, ...user } of data) {
			name = name.toUpperCase();
			const exists = await userRepository.findOneBy({ name });
			if (!exists) {
				let roles = [];

				if (user.roles.length > 0) {
					roles = await roleRepository.find({ where: { id: In(roles) }})
				}

				const newRole = userRepository.create({ ...user, name, roles });
				await userRepository.save(newRole);
			}
		}

		console.log('Users seeded successfully');
	}
}
