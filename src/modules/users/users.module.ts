import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-rol.entity';
import { RolesModule } from '../roles/roles.module';

const providers = [UsersService]

@Module({
	imports: [TypeOrmModule.forFeature([User, UserRole]), RolesModule],
	controllers: [UsersController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class UsersModule { }
