import { Transform } from 'class-transformer';
import { castArray, isArray, isNil, trim } from 'lodash';

/**
 * convertir cadena a número
 */
export function ToNumber(): PropertyDecorator {
	return Transform(
		(params) => {
			const value: any = params.value as string[] | string;

			if (isArray(value)) return value.map((v) => Number(v));

			return Number(value);
		},
		{ toClassOnly: true },
	);
}

/**
 * convertir cadena a int
 */
export function ToInt(): PropertyDecorator {
	return Transform(
		(params) => {
			const value: any = params.value as string[] | string;

			if (isArray(value)) return value.map((v) => Number.parseInt(v));

			return Number.parseInt(value);
		},
		{ toClassOnly: true },
	);
}

/**
 * convertir cadena a booleano
 */
export function ToBoolean(): PropertyDecorator {
	return Transform(
		(params) => {
			switch (params.value) {
				case 'true':
					return true;
				case 'false':
					return false;
				default:
					return params.value;
			}
		},
		{ toClassOnly: true },
	);
}

/**
 * convertir cadena en fecha
 */
export function ToDate(): PropertyDecorator {
	return Transform(
		(params) => {
			const { value } = params;

			if (!value) return;

			return new Date(value);
		},
		{ toClassOnly: true },
	);
}

/**
 * transforma a array, especialmente para parámetros de consulta
 */
export function ToArray(): PropertyDecorator {
	return Transform(
		(params) => {
			const { value } = params;

			if (isNil(value)) return [];

			return castArray(value);
		},
		{ toClassOnly: true },
	);
}

/**
 * recortar espacios del inicio y el final, sustituir varios espacios por uno.
 */
export function ToTrim(): PropertyDecorator {
	return Transform(
		(params) => {
			const value: any = params.value as string[] | string;

			if (isArray(value)) return value.map((v) => trim(v));

			return trim(value);
		},
		{ toClassOnly: true },
	);
}

/**
 * valor en minúsculas
 */
export function ToLowerCase(): PropertyDecorator {
	return Transform(
		(params) => {
			const value: any = params.value as string[] | string;

			if (!value) return;

			if (isArray(value)) return value.map((v) => v.toLowerCase());

			return value.toLowerCase();
		},
		{ toClassOnly: true },
	);
}

/**
 * valor en mayúsculas
 */
export function ToUpperCase(): PropertyDecorator {
	return Transform(
		(params) => {
			const value: any = params.value as string[] | string;

			if (!value) return;

			if (isArray(value)) return value.map((v) => v.toUpperCase());

			return value.toUpperCase();
		},
		{ toClassOnly: true },
	);
}
