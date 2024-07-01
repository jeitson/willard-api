import { SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from '../auth.constant';

/**
 * Decorador utilizado para marcar un controlador o método como público.
 * Esto indica que el acceso a este controlador o método no requiere autenticación.
 */
export const Public = () => SetMetadata(PUBLIC_KEY, true);
