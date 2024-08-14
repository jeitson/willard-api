import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { Pagination } from 'src/core/helper/paginate/pagination';
import { UserDto, UserQueryDto, UserUpdateDto } from './dto/user.dto';
import { Role } from '../roles/entities/rol.entity';
import { UserRole } from './entities/user-rol.entity';
export declare class UsersService {
    private readonly userRepository;
    private entityManager;
    private readonly rolesRepository;
    private readonly userRolRepository;
    constructor(userRepository: Repository<User>, entityManager: EntityManager, rolesRepository: Repository<Role>, userRolRepository: Repository<UserRole>);
    findAll({ page, pageSize, email, name, }: UserQueryDto): Promise<Pagination<User>>;
    findUserById(id: string): Promise<User | undefined>;
    create({ email, roles, ...data }: UserDto): Promise<void>;
    update(id: string, data: UserUpdateDto): Promise<void>;
    addRolToUser(userId: number, rolId: number): Promise<UserRole>;
}
