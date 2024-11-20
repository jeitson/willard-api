import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-rol.entity';
import { RolesModule } from '../roles/roles.module';
import { UserContextService } from './user-context.service';
import { Auth0Service } from './auth0.service';
import { UserCollectionSite } from './entities/user-collection_site.entity';
import { CollectionSitesModule } from '../collection_sites/collection_sites.module';
import { UserZone } from './entities/user-zone.entity';
import { CatalogsModule } from '../catalogs/catalogs.module';

const providers = [UsersService, UserContextService]

@Module({
	imports: [TypeOrmModule.forFeature([User, UserRole, UserCollectionSite, UserZone]), RolesModule, CollectionSitesModule, CatalogsModule],
	controllers: [UsersController],
	providers: [...providers, Auth0Service],
	exports: [TypeOrmModule, ...providers],
})
export class UsersModule { }
