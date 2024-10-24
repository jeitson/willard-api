import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { processContent } from 'src/core/utils';
import { BusinessException } from 'src/core/common/exceptions/biz.exception';

@Injectable()
export class MailerService {
	constructor(
		private readonly mailerService: NestMailerService,
		private readonly notificationsService: NotificationsService,
	) { }

	async send({
		to,
		subject,
		content,
		cc = [],
		type = 'text',
		context
	}: {
		to: string[];
		subject: string;
		content: string;
		cc?: string[];
		type?: 'text' | 'html';
		context?: any
	}): Promise<any> {
		try {
			content = processContent(content, context);

			const body = type === 'text' ? { text: content } : { html: content };

			const response = await this.mailerService.sendMail({
				to,
				subject,
				cc,
				...body,
			});

			if (!response) {
				throw new BusinessException('Error en el envío del correo', 500);
			}

			await this.notificationsService.createLog({
				name: 'Email Sent',
				addressee: to,
				body: content,
				subject,
			});

			return true;
		} catch (error) {
			throw error;
		}
	}
}
