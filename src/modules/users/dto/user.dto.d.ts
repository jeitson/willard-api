import { PagerDto } from 'src/core/common/dto/pager.dto';
export declare class UserDto {
    oauthId?: string;
    name: string;
    description: string;
    email: string;
    roles: number[];
}
declare const UserUpdateDto_base: import("@nestjs/common").Type<Partial<UserDto>>;
export declare class UserUpdateDto extends UserUpdateDto_base {
}
declare const UserQueryDto_base: import("@nestjs/common").Type<Partial<Omit<UserDto, "description" | "oauthId">> & PagerDto<UserDto>>;
export declare class UserQueryDto extends UserQueryDto_base {
}
export {};
