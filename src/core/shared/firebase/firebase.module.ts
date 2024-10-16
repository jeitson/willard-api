import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseService } from './firebase.service';
import { initializeFirebase } from 'src/core/config';

@Module({
	imports: [ConfigModule],
	providers: [
		FirebaseService,
		{
			provide: 'FIREBASE_INITIALIZER',
			useFactory: (configService: ConfigService) => {
				initializeFirebase();
			},
			inject: [ConfigService],
		},
	],
	exports: [FirebaseService],
})
export class FirebaseModule { }
