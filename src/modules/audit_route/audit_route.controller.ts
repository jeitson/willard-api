import { Controller } from '@nestjs/common';
import { AuditRouteService } from './audit_route.service';

@Controller('audit-route')
export class AuditRouteController {
	constructor(private readonly auditRouteService: AuditRouteService) { }
}
