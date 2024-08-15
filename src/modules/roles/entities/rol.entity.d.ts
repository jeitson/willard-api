import { CompleteEntity } from "src/core/common/entity/common.entity";
import { User } from "src/modules/users/entities/user.entity";
export declare class Role extends CompleteEntity {
    name: string;
    description: string;
    users: User[];
}
