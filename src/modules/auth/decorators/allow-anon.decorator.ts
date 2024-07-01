import { SetMetadata } from '@nestjs/common';
import { ALLOW_ANON_KEY } from '../auth.constant';

/**
 * Este decorador se utiliza para marcar los endpoints o métodos de controlador como públicos,
 * lo que significa que no requieren autenticación para acceder a ellos.
 */
export const AllowAnon = () => SetMetadata(ALLOW_ANON_KEY, true);
