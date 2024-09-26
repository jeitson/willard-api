import { forwardRef, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/rol.entity';
import { UsersModule } from '../users/users.module';

const providers = [RolesService]

@Module({
	imports: [TypeOrmModule.forFeature([Role]), forwardRef(() => UsersModule)],
	controllers: [RolesController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class RolesModule {}
