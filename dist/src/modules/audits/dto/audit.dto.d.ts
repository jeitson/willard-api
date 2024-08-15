import { PagerDto } from 'src/core/common/dto/pager.dto';
export declare class AuditDto {
    userId: string;
    name: string;
    description: string;
}
declare const AuditQueryDto_base: import("@nestjs/common").Type<Partial<Omit<AuditDto, "description">> & PagerDto<AuditDto>>;
export declare class AuditQueryDto extends AuditQueryDto_base {
}
export {};
