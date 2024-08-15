import { CompleteEntity } from "src/core/common/entity/common.entity";
import { Child } from "./child.entity";
export declare class Parent extends CompleteEntity {
    code: string;
    name: string;
    description: string;
    children: Child[];
}
