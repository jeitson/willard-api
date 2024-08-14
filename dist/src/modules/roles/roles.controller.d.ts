import { RolesService } from './roles.service';
import { RolDto, RolQueryDto, RolUpdateDto } from './dto/rol.dto';
import { Role } from './entities/rol.entity';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    findAll(dto: RolQueryDto): Promise<import("../../core/helper/paginate/pagination").Pagination<Role, import("../../core/helper/paginate/interface").IPaginationMeta>>;
    findOneById(id: string): Promise<Role>;
    create(dto: RolDto): Promise<void>;
    update(id: string, dto: RolUpdateDto): Promise<void>;
}
