import { Controller, Get } from '@nestjs/common';
import { NotesCreditsService } from './notes_credits.service';
import { AuditRouteService } from '../audit_route/audit_route.service';

@Controller('notes-credits')
export class NotesCreditsController {
	constructor(private readonly auditRouteService: AuditRouteService) { }

	// @Post('save')
	// @Roles(ROL.AUDITORIA_PH, ROL.ADMINISTRATOR)
	// @ApiOperation({ summary: 'Confirmación de conciliación' })
	// async confirm(@Body() body: ConfirmAuditRouteDto) {
	// 	return this.auditRouteService.confirm(body);
	// }
}
