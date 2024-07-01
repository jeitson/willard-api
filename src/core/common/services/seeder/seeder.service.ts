import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { CountryEntity } from 'src/modules/system/country/entities/country.entity';
import { EntityManager, Repository } from 'typeorm';

import countries from './../../../../resources/country';
import { RoleEntity } from 'src/modules/system/role/role.entity';
import { UserEntity } from 'src/modules/user/user.entity';
import { ParamConfigService } from 'src/modules/system/param-config/param-config.service';
import { md5, randomValue } from 'src/core/utils';
import { SYS_USER_INITPASSWORD } from 'src/core/constants/system.constant';

@Injectable()
export class SeederService {
	constructor(
		@InjectRepository(CountryEntity)
		private readonly countryRepository: Repository<CountryEntity>,
		@InjectRepository(RoleEntity)
		private readonly roleRepository: Repository<RoleEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		@InjectEntityManager() private entityManager: EntityManager,
		private readonly paramConfigService: ParamConfigService,
	) {}

	async seedInitialData(): Promise<void> {
		await Promise.all(
			countries.map(async (countryData) => {
				const country = this.countryRepository.create(countryData);
				await this.countryRepository.save(country);
			}),
		);

		const role = this.roleRepository.create({
			name: 'Administrador',
			value: 'ADMIN',
			remark: 'SUPER-ROL',
			status: true,
		});

		const t = await role.save();
		let password = 'administrator123';

		if (t) {
			await this.entityManager.transaction(async (manager) => {
				const salt = randomValue(32);

				if (!password) {
					const initPassword =
						await this.paramConfigService.findValueByKey(
							SYS_USER_INITPASSWORD,
						);
					password = md5(`${initPassword ?? '123456'}${salt}`);
				} else {
					password = md5(`${password ?? '123456'}${salt}`);
				}

				const u = manager.create(UserEntity, {
					username: 'admin',
					password,
					psalt: salt,
					email: 'admin@admin.com',
					phone: '123456789',
					status: true,
					roles: await this.roleRepository.findBy({ id: t.id }),
				});

				await manager.save(u);
			});
		}
	}
}
