import { CompleteEntity } from "src/core/common/entity/common.entity";
export declare class Client extends CompleteEntity {
    name: string;
    description: string;
    businessName: string;
    documentTypeId: number;
    countryId: number;
    documentNumber: string;
    referenceWLL: string;
    referencePH: string;
}
