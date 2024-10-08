import { ConfigType, registerAs } from '@nestjs/config';
import { env, envNumber } from '../global/env';

export const mailerRegToken = 'mailer';

const port = envNumber('SMTP_PORT');

export const MailerConfig = registerAs(mailerRegToken, () => ({
	host: env('SMTP_HOST'),
	port,
	secure: port !== 587,
	auth: {
		user: env('SMTP_USER'),
		pass: env('SMTP_PASS'),
	},
	tls: {
		rejectUnauthorized: false,
	},
}));

export type IMailerConfig = ConfigType<typeof MailerConfig>;
