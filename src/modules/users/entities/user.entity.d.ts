import { CompleteEntity } from "src/core/common/entity/common.entity";
import { UserRole } from "./user-rol.entity";
export declare class User extends CompleteEntity {
    oauthId: string;
    name: string;
    description: string;
    email: string;
    roles: UserRole[];
}
