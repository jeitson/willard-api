import { Module } from '@nestjs/common';

import { RouterModule } from '@nestjs/core';

import { UserModule } from '../user/user.module';

import { DeptModule } from './dept/dept.module';
import { MenuModule } from './menu/menu.module';
import { OnlineModule } from './online/online.module';
import { RoleModule } from './role/role.module';
import { LogModule } from './log/log.module';
import { ParamConfigModule } from './param-config/param-config.module';
import { CountryModule } from './country/country.module';

const modules = [
	UserModule,
	RoleModule,
	MenuModule,
	DeptModule,
	OnlineModule,
	LogModule,
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
