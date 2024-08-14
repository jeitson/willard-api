import { PagerDto } from 'src/core/common/dto/pager.dto';
export declare class ProductCreateDto {
    productTypeId: number;
    unitMeasureId: number;
    name: string;
    averageKg: number;
    recoveryPercentage: string;
    isCertifiable: boolean;
    reference1?: string;
    reference2?: string;
    reference3?: string;
    description?: string;
    referenceWLL: string;
    referencePH: string;
}
declare const ProductUpdateDto_base: import("@nestjs/common").Type<Partial<ProductCreateDto>>;
export declare class ProductUpdateDto extends ProductUpdateDto_base {
}
declare const ProductQueryDto_base: import("@nestjs/common").Type<Partial<Pick<ProductCreateDto, keyof ProductCreateDto>> & PagerDto<ProductCreateDto>>;
export declare class ProductQueryDto extends ProductQueryDto_base {
}
export {};
