"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeORMLogger = void 0;
const common_1 = require("@nestjs/common");
class TypeORMLogger {
    constructor(options) {
        this.options = options;
        this.logger = new common_1.Logger(TypeORMLogger.name);
    }
    logQuery(query, parameters) {
        if (!this.isEnable('query'))
            return;
        const sql = query +
            (parameters && parameters.length
                ? ` -- PARÁMETROS: ${this.stringifyParams(parameters)}`
                : '');
        this.logger.log(`[CONSULTA]: ${sql}`);
    }
    logQueryError(error, query, parameters) {
        if (!this.isEnable('error'))
            return;
        const sql = query +
            (parameters && parameters.length
                ? ` -- PARÁMETROS: ${this.stringifyParams(parameters)}`
                : '');
        this.logger.error([
            `[CONSULTA FALLIDA]: ${sql}`,
            `[ERROR EN CONSULTA]: ${error}`,
        ]);
    }
    logQuerySlow(time, query, parameters) {
        const sql = query +
            (parameters && parameters.length
                ? ` -- PARÁMETROS: ${this.stringifyParams(parameters)}`
                : '');
        this.logger.warn(`[CONSULTA LENTA: ${time} ms]: ${sql}`);
    }
    logSchemaBuild(message) {
        if (!this.isEnable('schema'))
            return;
        this.logger.log(message);
    }
    logMigration(message) {
        if (!this.isEnable('migration'))
            return;
        this.logger.log(message);
    }
    log(level, message) {
        if (!this.isEnable(level))
            return;
        switch (level) {
            case 'log':
                this.logger.debug(message);
                break;
            case 'info':
                this.logger.log(message);
                break;
            case 'warn':
                this.logger.warn(message);
                break;
            default:
                break;
        }
    }
    stringifyParams(parameters) {
        try {
            return JSON.stringify(parameters);
        }
        catch (error) {
            return parameters;
        }
    }
    isEnable(level) {
        return (this.options === 'all' ||
            this.options === true ||
            (Array.isArray(this.options) && this.options.includes(level)));
    }
}
exports.TypeORMLogger = TypeORMLogger;
//# sourceMappingURL=typeorm-logger.js.map