import { Module } from '@nestjs/common';
import { AuditsService } from './audits.service';
import { AuditsController } from './audits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audit } from './entities/audit.entity';
import { UsersModule } from '../users/users.module';

const providers = [AuditsService];

@Module({
	imports: [TypeOrmModule.forFeature([Audit]), UsersModule],
	controllers: [AuditsController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class AuditsModule { }
