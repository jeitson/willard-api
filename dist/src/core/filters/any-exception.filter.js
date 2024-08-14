"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const biz_exception_1 = require("../common/exceptions/biz.exception");
const error_code_constant_1 = require("../constants/error-code.constant");
const env_1 = require("../global/env");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    constructor() {
        this.logger = new common_1.Logger(AllExceptionsFilter_1.name);
        this.registerCatchAllExceptionsHook();
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const url = request.raw.url;
        const status = this.getStatus(exception);
        let message = this.getErrorMessage(exception);
        if (status === common_1.HttpStatus.INTERNAL_SERVER_ERROR &&
            !(exception instanceof biz_exception_1.BusinessException)) {
            common_1.Logger.error(exception, undefined, 'Catch');
            if (!env_1.isDev)
                message = error_code_constant_1.ErrorEnum.SERVER_ERROR?.split(':')[1];
        }
        else {
            this.logger.warn(`Message: (${status}) ${message} Path: ${decodeURI(url)}`);
        }
        const apiErrorCode = exception instanceof biz_exception_1.BusinessException
            ? exception.getErrorCode()
            : status;
        const resBody = {
            code: apiErrorCode,
            message,
            data: null,
        };
        response.status(status).send(resBody);
    }
    getStatus(exception) {
        if (exception instanceof common_1.HttpException) {
            return exception.getStatus();
        }
        else if (exception instanceof typeorm_1.QueryFailedError) {
            return common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        }
        else {
            return (exception?.status ??
                exception?.statusCode ??
                common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    getErrorMessage(exception) {
        if (exception instanceof common_1.HttpException) {
            return exception.message;
        }
        else if (exception instanceof typeorm_1.QueryFailedError) {
            return exception.message;
        }
        else {
            return (exception?.response?.message ??
                exception?.message ??
                `${exception}`);
        }
    }
    registerCatchAllExceptionsHook() {
        process.on('unhandledRejection', (reason) => {
            console.error('unhandledRejection: ', reason);
        });
        process.on('uncaughtException', (err) => {
            console.error('uncaughtException: ', err);
        });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [])
], AllExceptionsFilter);
//# sourceMappingURL=any-exception.filter.js.map