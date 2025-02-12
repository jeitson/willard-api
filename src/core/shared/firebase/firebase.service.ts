import { Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import { getFirebaseStorage } from 'src/core/config';
import { generateUUID } from 'src/core/utils';

@Injectable()
export class FirebaseService {
	constructor() { }

	async uploadFile(file: any): Promise<string> {
		const bucket = getFirebaseStorage();
		const fileName = `${generateUUID()}${extname(file.originalname)}`; // Generar un nombre único para el archivo
		const fileUpload = bucket.file(fileName);

		try {
			await fileUpload.save(file.buffer, {
				contentType: file.mimetype,
				metadata: {
					firebaseStorageDownloadTokens: fileName,
				},
			});
			return encodeURIComponent(fileName);
		} catch (error) {
			throw new BadRequestException('Error uploading file: ' + error.message);
		}
	}

	async getFileUrl(fileName: string): Promise<string> {
		const bucket = getFirebaseStorage();
		const file = bucket.file(fileName);

		const [exists] = await file.exists();
		if (!exists) {
			throw new BadRequestException('File not found');
		}

		const url = await file.getSignedUrl({
			action: 'read',
			expires: Date.now() + 60 * 60 * 1000,
		});

		return url[0];
	}

	async deleteFile(fileName: string): Promise<void> {
		const bucket = getFirebaseStorage();
		const file = bucket.file(fileName);
		const exists = await file.exists();

		if (!exists[0]) {
			throw new BadRequestException('File not found');
		}

		await file.delete();
	}
}
