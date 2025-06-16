import { Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { NotesCreditsService } from './notes_credits.service';
import { Roles } from 'src/core/common/decorators/role.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ROL } from 'src/core/constants/rol.constant';
import { NotesCreditQueryDto, NotesCreditResponseDto } from './dto/notes_credits.dto';
import { Public } from 'src/core/common/decorators/public.decorator';
import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { IdParam } from 'src/core/common/decorators/id-param.decorator';
import { RolesGuard } from 'src/core/guards/roles.guard';

@ApiTags('Negocio - Consulta de Notas de Crédito')
@Controller('notes-credits')
// @Public()
@UseGuards(RolesGuard)
export class NotesCreditsController {
	constructor(private readonly notesCreditsService: NotesCreditsService) { }

	@Get('')
	@Roles(ROL.AUDITORIA_PH, ROL.ADMINISTRATOR)
	@ApiResult({ type: [NotesCreditResponseDto] })
	@ApiOperation({ summary: 'Obtener listado de notas de créditos' })
	async findAll(@Query() query: NotesCreditQueryDto) {
		return this.notesCreditsService.findAll(query);
	}

	@Patch(':auditRouteId')
	@Roles(ROL.AUDITORIA_PH, ROL.ADMINISTRATOR)
	@ApiOperation({ summary: 'Confirmar notas de credito' })
	confirm(@IdParam('auditRouteId') id: number) {
		return this.notesCreditsService.confirm(id);
	}
}
