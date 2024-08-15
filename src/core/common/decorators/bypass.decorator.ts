import { SetMetadata } from '@nestjs/common';

export const BYPASS_KEY = '__bypass_key__';

/**
 * Añada este decorador cuando no sea necesaria la conversión al formato de retorno base.
 */
export function Bypass() {
	return SetMetadata(BYPASS_KEY, true);
}
