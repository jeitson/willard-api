import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { RoleModule } from '../system/role/role.module';
import { ParamConfigModule } from '../system/param-config/param-config.module';

const providers = [UserService];

@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity]),
		RoleModule,
		ParamConfigModule,
	],
	controllers: [UserController],
	providers: [...providers],
	exports: [TypeOrmModule, ...providers],
})
export class UserModule {}
