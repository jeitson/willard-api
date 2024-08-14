import { BaseEntity } from 'typeorm';
export declare abstract class CommonEntity extends BaseEntity {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    status: boolean;
}
export declare abstract class CompleteEntity extends CommonEntity {
    createdBy: string;
    modifiedBy: string;
}
