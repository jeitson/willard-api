import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class TimeoutInterceptor implements NestInterceptor {
    private readonly time;
    constructor(time?: number);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
