import { CompleteEntity } from "src/core/common/entity/common.entity";
export declare class Product extends CompleteEntity {
    productTypeId: number;
    unitMeasureId: number;
    name: string;
    averageKg: number;
    recoveryPercentage: string;
    isCertifiable: boolean;
    reference1: string;
    reference2: string;
    reference3: string;
    description: string;
    referenceWLL: string;
    referencePH: string;
}
