import { PagerDto } from 'src/core/common/dto/pager.dto';
export declare class RolDto {
    name: string;
    description: string;
}
declare const RolUpdateDto_base: import("@nestjs/common").Type<Partial<RolDto>>;
export declare class RolUpdateDto extends RolUpdateDto_base {
}
declare const RolQueryDto_base: import("@nestjs/common").Type<Partial<Omit<RolDto, "description">> & PagerDto<RolDto>>;
export declare class RolQueryDto extends RolQueryDto_base {
}
export {};
