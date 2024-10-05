import { Injectable } from '@nestjs/common'

import { MailerService as NestMailerService } from '@nestjs-modules/mailer'

@Injectable()
export class MailerService {
	constructor(
		private mailerService: NestMailerService,
	) { }

	async send({
		to,
		subject,
		content,
		type
	}:
		{
			to: string,
			subject: string,
			content: string,
			type: 'text' | 'html',
		} = { to: '', subject: '', content: '', type: 'text' }
	): Promise<any> {
		if (type === 'text') {
			return this.mailerService.sendMail({
				to,
				subject,
				text: content,
			})
		}
		else {
			return this.mailerService.sendMail({
				to,
				subject,
				html: content,
			})
		}
	}
}
