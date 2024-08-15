import { AuditDto, AuditQueryDto } from './dto/audit.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { Audit } from './entities/audit.entity';
import { EntityManager, Repository } from 'typeorm';
export declare class AuditsService {
    private readonly auditsRepository;
    private entityManager;
    constructor(auditsRepository: Repository<Audit>, entityManager: EntityManager);
    findAll({ page, pageSize, name }: AuditQueryDto): Promise<Pagination<Audit>>;
    findOneById(id: number): Promise<Audit | undefined>;
    create({ name, description, userId }: AuditDto): Promise<void>;
}
