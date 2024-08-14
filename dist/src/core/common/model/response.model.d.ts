export declare class ResOp<T = any> {
    data?: T;
    code: number;
    message: string;
    constructor(code: number, data: T, message?: string);
    static success<T>(data?: T, message?: string): ResOp<T>;
    static error(code: number, message: any): ResOp<{}>;
}
export declare class TreeResult<T> {
    id: string;
    parentId: number;
    children?: TreeResult<T>[];
}
