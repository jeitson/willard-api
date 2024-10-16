import { registerAs, ConfigType } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { env } from '../global/env';

export const firebaseRegToken = 'firebase';

export const FirebaseConfig = registerAs(firebaseRegToken, () => ({
	projectId: env('FIREBASE_PROJECT_ID'),
	privateKey: env('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
	clientEmail: env('FIREBASE_CLIENT_EMAIL'),
	storageBucket: env('FIREBASE_STORAGE_BUCKET'),
}));

export type IFirebaseConfig = ConfigType<typeof FirebaseConfig>;

export const initializeFirebase = () => {
	const config = FirebaseConfig();
	admin.initializeApp({
		credential: admin.credential.cert({
			projectId: config.projectId,
			privateKey: config.privateKey,
			clientEmail: config.clientEmail,
		}),
		storageBucket: config.storageBucket,
	});
};

export const getFirebaseStorage = () => {
	return admin.storage().bucket();
};
