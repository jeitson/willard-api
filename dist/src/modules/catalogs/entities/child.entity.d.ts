import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Parent } from "./parent.entity";
export declare class Child extends CompleteEntity {
    parentId: number;
    catalogCode: string;
    name: string;
    description: string;
    order: number;
    extra1: string;
    extra2: string;
    extra3: string;
    extra4: string;
    extra5: string;
    parent: Parent;
}
