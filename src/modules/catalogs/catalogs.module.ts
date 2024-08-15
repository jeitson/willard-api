import { Module } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CatalogsController } from './catalogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parent } from './entities/parent.entity';
import { Child } from './entities/child.entity';

const providers = [CatalogsService];

@Module({
	imports: [TypeOrmModule.forFeature([Parent, Child])],
	controllers: [CatalogsController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class CatalogsModule { }
