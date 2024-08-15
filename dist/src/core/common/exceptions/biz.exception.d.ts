import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorEnum } from 'src/core/constants/error-code.constant';
export declare class BusinessException extends HttpException {
    private errorCode;
    constructor(error: ErrorEnum | string, errorCode?: HttpStatus);
    getErrorCode(): number;
}
export { BusinessException as BizException };
