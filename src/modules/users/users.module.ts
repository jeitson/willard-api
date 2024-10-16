import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-rol.entity';
import { RolesModule } from '../roles/roles.module';
import { UserContextService } from './user-context.service';
import { Auth0Service } from './auth0.service';

const providers = [UsersService, UserContextService]

@Module({
	imports: [TypeOrmModule.forFeature([User, UserRole]), RolesModule],
	controllers: [UsersController],
	providers: [...providers, Auth0Service],
	exports: [TypeOrmModule, ...providers],
})
export class UsersModule { }
