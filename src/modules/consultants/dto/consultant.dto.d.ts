import { PagerDto } from 'src/core/common/dto/pager.dto';
export declare class ConsultantCreateDto {
    name: string;
    email: string;
    phone: string;
    description?: string;
    referencePH: string;
}
declare const ConsultantUpdateDto_base: import("@nestjs/common").Type<Partial<ConsultantCreateDto>>;
export declare class ConsultantUpdateDto extends ConsultantUpdateDto_base {
}
declare const ConsultantQueryDto_base: import("@nestjs/common").Type<Partial<Omit<ConsultantCreateDto, "description" | "referencePH">> & PagerDto<ConsultantCreateDto>>;
export declare class ConsultantQueryDto extends ConsultantQueryDto_base {
}
export {};
