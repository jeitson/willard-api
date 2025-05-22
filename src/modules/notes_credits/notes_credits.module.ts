import { forwardRef, Module } from '@nestjs/common';
import { NotesCreditsService } from './notes_credits.service';
import { NotesCreditsController } from './notes_credits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesCredit } from './entities/notes_credit.entity';
import { UsersModule } from '../users/users.module';
import { AuditRouteModule } from '../audit_route/audit_route.module';

const providers = [NotesCreditsService]

@Module({
	imports: [TypeOrmModule.forFeature([NotesCredit]), UsersModule, forwardRef(() => AuditRouteModule)],
	controllers: [NotesCreditsController],
	providers,
	exports: [TypeOrmModule, ...providers],
})
export class NotesCreditsModule { }
