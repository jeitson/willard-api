import { NotFoundException } from '@nestjs/common';
export declare const NotFoundMessage: string[];
export declare class CannotFindException extends NotFoundException {
    constructor();
}
