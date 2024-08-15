"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BizException = exports.BusinessException = void 0;
const common_1 = require("@nestjs/common");
const response_constant_1 = require("../../constants/response.constant");
class BusinessException extends common_1.HttpException {
    constructor(error, errorCode = common_1.HttpStatus.BAD_REQUEST) {
        if (!error.includes(':')) {
            super(common_1.HttpException.createBody({
                code: errorCode,
                message: error,
            }), errorCode);
            this.errorCode = response_constant_1.RESPONSE_SUCCESS_CODE;
            return;
        }
        const [code, message] = error.split(':');
        super(common_1.HttpException.createBody({
            code: errorCode,
            message,
        }), errorCode);
        this.errorCode = Number(code);
    }
    getErrorCode() {
        return this.errorCode;
    }
}
exports.BusinessException = BusinessException;
exports.BizException = BusinessException;
//# sourceMappingURL=biz.exception.js.map