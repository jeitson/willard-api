"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateRaw = paginateRaw;
exports.paginateRawAndEntities = paginateRawAndEntities;
exports.paginate = paginate;
const typeorm_1 = require("typeorm");
const create_pagination_1 = require("./create-pagination");
const interface_1 = require("./interface");
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;
function resolveOptions(options) {
    const { page, pageSize, paginationType } = options;
    return [
        page || DEFAULT_PAGE,
        pageSize || DEFAULT_LIMIT,
        paginationType || interface_1.PaginationTypeEnum.TAKE_AND_SKIP,
    ];
}
async function paginateRepository(repository, options, searchOptions) {
    const [page, limit] = resolveOptions(options);
    const promises = [
        repository.find({
            skip: limit * (page - 1),
            take: limit,
            ...searchOptions,
        }),
        undefined,
    ];
    const [items, total] = await Promise.all(promises);
    return (0, create_pagination_1.createPaginationObject)({
        items,
        totalItems: total,
        currentPage: page,
        limit,
    });
}
async function paginateQueryBuilder(queryBuilder, options) {
    const [page, limit, paginationType] = resolveOptions(options);
    if (paginationType === interface_1.PaginationTypeEnum.TAKE_AND_SKIP)
        queryBuilder.take(limit).skip((page - 1) * limit);
    else
        queryBuilder.limit(limit).offset((page - 1) * limit);
    const [items, total] = await queryBuilder.getManyAndCount();
    return (0, create_pagination_1.createPaginationObject)({
        items,
        totalItems: total,
        currentPage: page,
        limit,
    });
}
async function paginateRaw(queryBuilder, options) {
    const [page, limit, paginationType] = resolveOptions(options);
    const promises = [
        (paginationType === interface_1.PaginationTypeEnum.LIMIT_AND_OFFSET
            ? queryBuilder.limit(limit).offset((page - 1) * limit)
            : queryBuilder.take(limit).skip((page - 1) * limit)).getRawMany(),
        queryBuilder.getCount(),
    ];
    const [items, total] = await Promise.all(promises);
    return (0, create_pagination_1.createPaginationObject)({
        items,
        totalItems: total,
        currentPage: page,
        limit,
    });
}
async function paginateRawAndEntities(queryBuilder, options) {
    const [page, limit, paginationType] = resolveOptions(options);
    const promises = [
        (paginationType === interface_1.PaginationTypeEnum.LIMIT_AND_OFFSET
            ? queryBuilder.limit(limit).offset((page - 1) * limit)
            : queryBuilder.take(limit).skip((page - 1) * limit)).getRawAndEntities(),
        queryBuilder.getCount(),
    ];
    const [itemObject, total] = await Promise.all(promises);
    return [
        (0, create_pagination_1.createPaginationObject)({
            items: itemObject.entities,
            totalItems: total,
            currentPage: page,
            limit,
        }),
        itemObject.raw,
    ];
}
async function paginate(repositoryOrQueryBuilder, options, searchOptions) {
    return repositoryOrQueryBuilder instanceof typeorm_1.Repository
        ? paginateRepository(repositoryOrQueryBuilder, options, searchOptions)
        : paginateQueryBuilder(repositoryOrQueryBuilder, options);
}
//# sourceMappingURL=index.js.map