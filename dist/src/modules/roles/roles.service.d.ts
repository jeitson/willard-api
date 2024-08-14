import { Role } from './entities/rol.entity';
import { EntityManager, Repository } from 'typeorm';
import { RolDto, RolQueryDto, RolUpdateDto } from './dto/rol.dto';
import { Pagination } from 'src/core/helper/paginate/pagination';
export declare class RolesService {
    private readonly rolesRepository;
    private entityManager;
    constructor(rolesRepository: Repository<Role>, entityManager: EntityManager);
    findAll({ page, pageSize, name }: RolQueryDto): Promise<Pagination<Role>>;
    findOneById(id: number): Promise<Role | undefined>;
    create({ name, description }: RolDto): Promise<void>;
    update(id: number, data: RolUpdateDto): Promise<void>;
}
