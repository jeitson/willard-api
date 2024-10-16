import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import { envNumber } from '../global/env';

export const multerOptions = {
	limits: {
		fileSize: envNumber('MAX_FILE_SIZE'),
	},
	fileFilter: (req: any, file: any, cb: any) => {
		// Puedes descomentar la validación de tipo de archivo si es necesario
		if (file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf|doc|docx)$/)) {
			cb(null, true);
		} else {
			cb(
				new HttpException(
					`Unsupported file type ${extname(file.originalname)}`,
					HttpStatus.BAD_REQUEST,
				),
				false,
			);
		}
	},
};
