import { AuditsService } from './audits.service';
import { Audit } from './entities/audit.entity';
import { AuditQueryDto } from './dto/audit.dto';
export declare class AuditsController {
    private readonly auditsService;
    constructor(auditsService: AuditsService);
    findAll(dto: AuditQueryDto): Promise<import("../../core/helper/paginate/pagination").Pagination<Audit, import("../../core/helper/paginate/interface").IPaginationMeta>>;
    findOneById(id: string): Promise<Audit>;
}
