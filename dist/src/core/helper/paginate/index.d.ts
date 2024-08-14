import { FindManyOptions, FindOptionsWhere, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { IPaginationOptions } from './interface';
import { Pagination } from './pagination';
export declare function paginateRaw<T>(queryBuilder: SelectQueryBuilder<T>, options: IPaginationOptions): Promise<Pagination<T>>;
export declare function paginateRawAndEntities<T>(queryBuilder: SelectQueryBuilder<T>, options: IPaginationOptions): Promise<[Pagination<T>, Partial<T>[]]>;
export declare function paginate<T extends ObjectLiteral>(repository: Repository<T>, options: IPaginationOptions, searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>): Promise<Pagination<T>>;
export declare function paginate<T>(queryBuilder: SelectQueryBuilder<T>, options: IPaginationOptions): Promise<Pagination<T>>;
