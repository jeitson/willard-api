import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/rol.entity';

const providers = [RolesService]

@Module({
	imports: [TypeOrmModule.forFeature([Role])],
	controllers: [RolesController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class RolesModule {}
