import {
	HttpStatus,
	NotAcceptableException,
	Param,
	ParseIntPipe,
} from '@nestjs/common';

import { IsUUID } from 'class-validator';

export class UUIDParamDto {
	@IsUUID()
	id: string;
}

export function IdParam(key: string = 'id') {
	return Param(key,
		new ParseIntPipe({
			errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
			exceptionFactory: () => {
				throw new NotAcceptableException('ID Formato incorrecto');
			},
		}),
	);
}
