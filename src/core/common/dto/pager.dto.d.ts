export declare enum Order {
    ASC = "ASC",
    DESC = "DESC"
}
export declare class PagerDto<T> {
    page?: number;
    pageSize?: number;
    order?: Order;
    _t?: number;
}
