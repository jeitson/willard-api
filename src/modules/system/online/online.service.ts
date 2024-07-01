/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { throttle } from 'lodash';

import { BusinessException } from 'src/core/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/core/constants/error-code.constant';


import { SseService } from 'src/modules/sse/sse.service';

import { UserService } from '../../user/user.service';

import { OnlineUserInfo } from './online.model';

@Injectable()
export class OnlineService {
	constructor(
		private readonly userService: UserService,
		private sseService: SseService,
	) {}

	updateOnlineUserCount = throttle(async () => {
		// Función de actualización del recuento de usuarios en línea
	}, 3000);

	async addOnlineUser(value: string, ip: string, ua: string) {
		// Agregar usuario en línea
		return;
	}

	async removeOnlineUser(value: string) {
		// Eliminar usuario en línea
		return;
	}

	/** Eliminar todos los usuarios en línea */
	async clearOnlineUser() {
		// Limpiar todos los usuarios en línea
		return;
	}

	/**
	 * Listar usuarios en línea
	 */
	async listOnlineUser(value: string): Promise<OnlineUserInfo[]> {
		// Listar usuarios en línea
		return [];
	}

	/**
	 * Desconectar usuario
	 */
	async kickUser(tokenId: string, user: IAuthUser): Promise<void> {
		// Desconectar usuario específico
		return;
	}
}
