import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Parent } from 'src/modules/catalogs/entities/parent.entity';
import { dataChild, dataParent } from './data';
import { Child } from 'src/modules/catalogs/entities/child.entity';

@Injectable()
export class CatalogsSeeder {
	constructor(private readonly dataSource: DataSource) { }

	async run() {
		this.createParent();
		this.createChild();
	}

	async createParent(): Promise<void> {
		const parentRepository = this.dataSource.getRepository(Parent);

		for (let { id, code, ...parent } of dataParent) {
			code = code.toUpperCase();

			const exists = await parentRepository.findOneBy({ code });
			if (!exists) {
				const newParent = parentRepository.create({ ...parent, code, id });
				await parentRepository.save(newParent);
			}
		}

		console.log('Parents seeded successfully');
	}

	async createChild(): Promise<void> {
		const childRepository = this.dataSource.getRepository(Child);
		const parentRepository = this.dataSource.getRepository(Parent);


		for (let { name, ...child } of dataChild) {
			name = name.toUpperCase();

			const exists = await childRepository.findOneBy({ name });
			if (!exists) {
				const parent = await parentRepository.findOneBy({ name: child.catalogCode });
				if (parent) {
					const newParent = childRepository.create({ ...child, name, parent });
					await childRepository.save(newParent);
				}
			}
		}

		console.log('Childs seeded successfully');
	}
}
