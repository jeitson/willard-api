import { Pagination } from './pagination';
export declare function createPaginationObject<T>({ items, totalItems, currentPage, limit, }: {
    items: T[];
    totalItems?: number;
    currentPage: number;
    limit: number;
}): Pagination<T>;
