import { PagerDto } from 'src/core/common/dto/pager.dto';
export declare class ClientCreateDto {
    name: string;
    description?: string;
    businessName: string;
    documentTypeId: number;
    countryId: number;
    documentNumber: string;
    referenceWLL: string;
    referencePH: string;
}
declare const ClientUpdateDto_base: import("@nestjs/common").Type<Partial<ClientCreateDto>>;
export declare class ClientUpdateDto extends ClientUpdateDto_base {
}
declare const ClientQueryDto_base: import("@nestjs/common").Type<Partial<Pick<ClientCreateDto, keyof ClientCreateDto>> & PagerDto<ClientCreateDto>>;
export declare class ClientQueryDto extends ClientQueryDto_base {
}
export {};
