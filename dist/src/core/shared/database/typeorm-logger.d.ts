import { Logger as ITypeORMLogger, LoggerOptions } from 'typeorm';
export declare class TypeORMLogger implements ITypeORMLogger {
    private options;
    private logger;
    constructor(options: LoggerOptions);
    logQuery(query: string, parameters?: any[]): void;
    logQueryError(error: string | Error, query: string, parameters?: any[]): void;
    logQuerySlow(time: number, query: string, parameters?: any[]): void;
    logSchemaBuild(message: string): void;
    logMigration(message: string): void;
    log(level: 'warn' | 'info' | 'log', message: any): void;
    private stringifyParams;
    private isEnable;
}
