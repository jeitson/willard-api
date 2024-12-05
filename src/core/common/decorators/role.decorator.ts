import { SetMetadata } from '@nestjs/common';
import { ROL } from 'src/core/constants/rol.constant';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ROL[]) => SetMetadata(ROLES_KEY, roles);
