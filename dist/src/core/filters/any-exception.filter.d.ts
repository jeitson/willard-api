import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger;
    constructor();
    catch(exception: unknown, host: ArgumentsHost): void;
    getStatus(exception: unknown): number;
    getErrorMessage(exception: unknown): string;
    registerCatchAllExceptionsHook(): void;
}
