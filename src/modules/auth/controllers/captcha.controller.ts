import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { isEmpty } from 'lodash';
// import * as svgCaptcha from 'svg-captcha'; // Librería para generar captchas en formato SVG

import { ApiResult } from 'src/core/common/decorators/api-result.decorator';
import { generateUUID } from 'src/core/utils'; // Función para generar UUID

import { Public } from '../decorators/public.decorator'; // Decorador para indicar que la ruta es pública

import { ImageCaptchaDto } from '../dto/captcha.dto'; // DTO para validar los parámetros de la solicitud
import { ImageCaptcha } from '../models/auth.model'; // Modelo de datos para la respuesta del captcha

@ApiTags('Captcha - Módulo CAPTCHA') // Etiqueta para el controlador en Swagger
@Controller('auth/captcha') // Ruta base del controlador para endpoints relacionados con captchas
export class CaptchaController {
	constructor() {}

	@Get('img') // Endpoint para obtener una imagen de captcha
	@ApiOperation({ summary: 'Obtener imagen de captcha para autenticación' }) // Descripción en Swagger
	@ApiResult({ type: ImageCaptcha }) // Especifica el tipo de respuesta para Swagger
	@Public() // Indica que este endpoint es público y no requiere autenticación
	async captchaByImg(@Query() dto: ImageCaptchaDto): Promise<ImageCaptcha> {
		const { width, height } = dto; // Obtiene el ancho y alto especificado en el DTO

		// Genera un captcha en formato SVG
		// const svg = svgCaptcha.create({
		// 	size: 4, // Longitud del texto del captcha
		// 	color: true, // Usa colores en el captcha
		// 	noise: 4, // Añade ruido para hacer el captcha más difícil de leer
		// 	width: isEmpty(width) ? 100 : width, // Ancho de la imagen (por defecto 100)
		// 	height: isEmpty(height) ? 50 : height, // Alto de la imagen (por defecto 50)
		// 	charPreset: '1234567890', // Caracteres permitidos en el captcha (solo números)
		// });

		// Prepara la respuesta con la imagen de captcha en formato base64 y un ID único
		const result: ImageCaptcha = {
			img: `data:image/svg+xml;base64,${Buffer.from('').toString('base64')}`,
			id: generateUUID(), // Genera un ID único para identificar este captcha
		};

		return result; // Retorna la respuesta con la imagen de captcha y su ID
	}
}
