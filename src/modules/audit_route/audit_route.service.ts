import { Injectable } from '@nestjs/common';
import { ListAuditRouteDto } from './dto/audit_route.dto';

@Injectable()
export class AuditRouteService {

	async findAll(): Promise<ListAuditRouteDto[]> {
		return [];
	}
}
