import { PagerDto } from 'src/core/common/dto/pager.dto';
export declare class ChildDto {
    catalogCode: string;
    parentId: number;
    name: string;
    description: string;
    order?: number;
    extra1: string;
    extra2: string;
    extra3: string;
    extra4: string;
    extra5: string;
}
declare const ChildUpdateDto_base: import("@nestjs/common").Type<Partial<ChildDto>>;
export declare class ChildUpdateDto extends ChildUpdateDto_base {
}
declare const ChildQueryDto_base: import("@nestjs/common").Type<Partial<Omit<ChildDto, "description" | "order" | "extra1" | "extra2" | "extra3" | "extra4" | "extra5">> & PagerDto<ChildDto>>;
export declare class ChildQueryDto extends ChildQueryDto_base {
}
export declare class ChildSearchDto {
    keys: string[];
}
export {};
