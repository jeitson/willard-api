import { Injectable, BadRequestException } from '@nestjs/common';
import { Express } from 'express';
import { getFirebaseStorage } from 'src/core/config';

@Injectable()
export class FirebaseService {
	constructor() { }

	async uploadFile(file: Express.Multer.File): Promise<string> {
		const bucket = getFirebaseStorage();
		const fileName = `${Date.now()}_${file.originalname}`;
		const fileUpload = bucket.file(fileName);

		try {
			await fileUpload.save(file.buffer, {
				contentType: file.mimetype,
				metadata: {
					firebaseStorageDownloadTokens: fileName,
				},
			});
			return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${fileName}`;
		} catch (error) {
			throw new BadRequestException('Error uploading file: ' + error.message);
		}
	}

	async getFileUrl(fileName: string): Promise<string> {
		const bucket = getFirebaseStorage();
		const file = bucket.file(fileName);
		const exists = await file.exists();

		if (!exists[0]) {
			throw new BadRequestException('File not found');
		}

		return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
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
