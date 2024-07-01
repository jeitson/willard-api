import { Module } from '@nestjs/common';

import { RouterModule } from '@nestjs/core';

import { UserModule } from '../user/user.module';

import { DeptModule } from './dept/dept.module';
import { MenuModule } from './menu/menu.module';
import { RoleModule } from './role/role.module';
import { ParamConfigModule } from './param-config/param-config.module';
import { CountryModule } from './country/country.module';

const modules = [
	UserModule,
	RoleModule,
	MenuModule,
	DeptModule,
	ParamConfigModule,
	CountryModule,
];

@Module({
	imports: [
		...modules,
		RouterModule.register([
			{
				path: 'system',
				module: SystemModule,
				children: [...modules],
			},
		]),
	],
	exports: [...modules],
})
export class SystemModule {}
