import { ApiProperty } from '@nestjs/swagger';

export class ImageCaptcha {
	@ApiProperty({ description: 'Imagen SVG en formato base64' })
	img: string;

	@ApiProperty({ description: 'Identificador único asociado al captcha' })
	id: string;
}

export class LoginToken {
	@ApiProperty({ description: 'Token JWT de identidad' })
	token: string;
}
