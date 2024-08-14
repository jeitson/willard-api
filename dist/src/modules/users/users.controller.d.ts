import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserDto, UserQueryDto, UserUpdateDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(dto: UserQueryDto): Promise<import("../../core/helper/paginate/pagination").Pagination<User, import("../../core/helper/paginate/interface").IPaginationMeta>>;
    findOneById(id: string): Promise<User>;
    create(dto: UserDto): Promise<void>;
    update(id: string, dto: UserUpdateDto): Promise<void>;
    addRolToUser(id: string, rol_id: string): Promise<void>;
}
