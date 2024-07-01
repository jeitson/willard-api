import {
	HttpStatus,
	NotAcceptableException,
	Param,
	ParseUUIDPipe,
} from '@nestjs/common';

import { IsUUID } from 'class-validator';

export class UUIDParamDto {
	@IsUUID()
	id: string;
}

export function IdParam() {
	return Param(
		'id',
		new ParseUUIDPipe({
			errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
			exceptionFactory: () => {
				throw new NotAcceptableException('ID Formato incorrecto');
			},
		}),
	);
}
