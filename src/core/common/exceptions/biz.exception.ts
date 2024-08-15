import { HttpException, HttpStatus } from '@nestjs/common';

import { ErrorEnum } from 'src/core/constants/error-code.constant';
import {
	RESPONSE_SUCCESS_CODE,
} from 'src/core/constants/response.constant';

export class BusinessException extends HttpException {
	private errorCode: number;

	constructor(
		error: ErrorEnum | string,
		errorCode: HttpStatus = HttpStatus.BAD_REQUEST,
	) {
		// Si no es un errorEnum
		if (!error.includes(':')) {
			super(
				HttpException.createBody({
					code: errorCode,
					message: error,
				}),
				errorCode,
			);
			this.errorCode = RESPONSE_SUCCESS_CODE;
			return;
		}


		const [code, message] = error.split(':');
		super(
			HttpException.createBody({
				code: errorCode,
				message,
			}),
			errorCode,
		);

		this.errorCode = Number(code);
	}

	getErrorCode(): number {
		return this.errorCode;
	}
}

export { BusinessException as BizException };
