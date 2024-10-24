import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';

import { isDev } from '../global/env';
import { MailerModule } from './mailer/mailer.module';

@Global()
@Module({
	imports: [
		// http
		HttpModule,
		// schedule
		ScheduleModule.forRoot(),
		// rate limit
		ThrottlerModule.forRoot([
			{
				limit: 3,
				ttl: 60000,
			},
		]),
		EventEmitterModule.forRoot({
			wildcard: true,
			delimiter: '.',
			newListener: false,
			removeListener: false,
			maxListeners: 20,
			verboseMemoryLeak: isDev,
			ignoreErrors: false,
		}),
		MailerModule,
	],
	exports: [HttpModule],
})
export class SharedModule {}
