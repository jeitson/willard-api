import { ObjectLiteral } from 'typeorm';
import { IPaginationMeta } from './interface';
export declare class Pagination<PaginationObject, T extends ObjectLiteral = IPaginationMeta> {
    readonly items: PaginationObject[];
    readonly meta: T;
    constructor(items: PaginationObject[], meta: T);
}
