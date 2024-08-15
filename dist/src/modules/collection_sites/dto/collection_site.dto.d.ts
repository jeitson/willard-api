import { PagerDto } from 'src/core/common/dto/pager.dto';
export declare class CollectionSiteCreateDto {
    siteTypeId: number;
    countryId: number;
    cityId: number;
    name: string;
    description?: string;
    taxId: string;
    businessName: string;
    neighborhood: string;
    address: string;
    latitude?: string;
    longitude?: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    referenceWLL: string;
    referencePH: string;
}
declare const CollectionSiteUpdateDto_base: import("@nestjs/common").Type<Partial<CollectionSiteCreateDto>>;
export declare class CollectionSiteUpdateDto extends CollectionSiteUpdateDto_base {
}
declare const CollectionSiteQueryDto_base: import("@nestjs/common").Type<Partial<Pick<CollectionSiteCreateDto, keyof CollectionSiteCreateDto>> & PagerDto<CollectionSiteCreateDto>>;
export declare class CollectionSiteQueryDto extends CollectionSiteQueryDto_base {
}
export {};
