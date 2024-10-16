import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
	transform(files: any[]) {
		console.log(files);
		const maxSize = 1024 * 1000; // 1 KB en bytes

		const filesNotAllowed = files.filter((file) => file.size > maxSize);

		if (filesNotAllowed.length) {
			if (filesNotAllowed.length === 1) {
				throw new BadRequestException(
					`El archivo ${filesNotAllowed[0].originalname}, excede el tamaño máximo permitido de 1 KB`,
				);
			}

			throw new BadRequestException(
				`Los archivos ${filesNotAllowed.map((file) => file.originalname).join(', ')}, exceden el tamaño máximo permitido de 1 KB`,
			);
		}
		return files;
	}
}
