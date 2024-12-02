import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/rol.entity';
import { RolesSeeder } from './roles/service';
import { UsersSeeder } from './users/service';
import { CatalogsSeeder } from './catalogs/service';
import { Parent } from '../catalogs/entities/parent.entity';
import { Child } from '../catalogs/entities/child.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User, Role, Parent, Child])],
	providers: [SeedService, RolesSeeder, UsersSeeder, CatalogsSeeder],
})
export class SeedModule { }
