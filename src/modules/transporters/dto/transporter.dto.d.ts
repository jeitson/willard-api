import { PagerDto } from 'src/core/common/dto/pager.dto';
export declare class TransporterCreateDto {
    name: string;
    taxId: string;
    businessName: string;
    description?: string;
    contactName: string;
    contactEmail: string;
    referenceWLL: string;
    referencePH: string;
}
declare const TransporterUpdateDto_base: import("@nestjs/common").Type<Partial<TransporterCreateDto>>;
export declare class TransporterUpdateDto extends TransporterUpdateDto_base {
}
declare const TransporterQueryDto_base: import("@nestjs/common").Type<Partial<Pick<TransporterCreateDto, keyof TransporterCreateDto>> & PagerDto<TransporterCreateDto>>;
export declare class TransporterQueryDto extends TransporterQueryDto_base {
}
export {};
