import { Controller, Get, Query } from '@nestjs/common';
import { NotesCreditsService } from './notes_credits.service';
import { AuditRouteService } from '../audit_route/audit_route.service';
import { Roles } from 'src/core/common/decorators/role.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ROL } from 'src/core/constants/rol.constant';
import { NotesCreditQueryDto, NotesCreditResponseDto } from './dto/notes_credits.dto';
import { Public } from 'src/core/common/decorators/public.decorator';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';

@ApiTags('Negocio - Consulta de Notas de Crédito')
@Controller('notes-credits')
@Public()
export class NotesCreditsController {
	constructor(private readonly notesCreditsService: NotesCreditsService) { }

	@Get('')
	// @Roles(ROL.AUDITORIA_PH, ROL.ADMINISTRATOR)
	@ApiResult({ type: [NotesCreditResponseDto] })
	@ApiOperation({ summary: 'Confirmación de conciliación' })
	async findAll(@Query() query: NotesCreditQueryDto) {
		return this.notesCreditsService.findAll(query);
	}
}
