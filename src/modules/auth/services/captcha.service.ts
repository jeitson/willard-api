/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

// import { CaptchaLogService } from 'src/modules/system/log/services/captcha-log.service';

@Injectable()
export class CaptchaService {
	// constructor(private captchaLogService: CaptchaLogService) {}

	async checkImgCaptcha(id: string, code: string): Promise<void> {
		return;
	}

	async log(
		account: string,
		code: string,
		provider: 'sms' | 'email',
		uid?: number,
	): Promise<void> {
		// await this.captchaLogService.create(account, code, provider, uid);
	}
}
