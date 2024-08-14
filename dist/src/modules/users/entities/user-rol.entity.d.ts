import { User } from 'src/modules/users/entities/user.entity';
import { Role } from 'src/modules/roles/entities/rol.entity';
export declare class UserRole {
    userId: string;
    roleId: string;
    user: User;
    role: Role;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
