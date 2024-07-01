import {
	BeforeApplicationShutdown,
	Controller,
	Headers,
	Ip,
	Param,
	ParseIntPipe,
	Req,
	Res,
	Sse,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Observable, interval } from 'rxjs';

import { OnlineService } from '../system/online/online.service';

import { MessageEvent, SseService } from './sse.service';
import { ApiSecurityAuth } from 'src/core/common/decorators/swagger.decorator';

@ApiTags('Sistema - Módulo SSE')
@ApiSecurityAuth()
@Controller('sse')
export class SseController implements BeforeApplicationShutdown {
	private replyMap: Map<string, FastifyReply> = new Map();

	constructor(
		private readonly sseService: SseService,
		private onlineService: OnlineService,
	) {}

	private closeAllConnect() {
		this.sseService.sendToAllUser({
			type: 'close',
			data: '¡Adiós!',
		});
		this.replyMap.forEach((reply) => {
			reply.raw.end().destroy();
		});
	}

	// Se ejecuta al cerrar la aplicación desde la consola
	beforeApplicationShutdown() {
		this.closeAllConnect();
	}

	@ApiOperation({ summary: 'Push de mensajes desde el servidor' })
	@Sse(':uid')
	async sse(
		@Param('uid', ParseIntPipe) uid: string,
		@Req() req: FastifyRequest,
		@Res() res: FastifyReply,
		@Ip() ip: string,
		@Headers('user-agent') ua: string,
	): Promise<Observable<MessageEvent>> {
		this.replyMap.set(uid, res);
		this.onlineService.addOnlineUser(req.accessToken, ip, ua);

		return new Observable((subscriber) => {
			// Envío periódico para mantener la conexión
			const subscription = interval(12000).subscribe(() => {
				subscriber.next({ type: 'ping' });
			});

			this.sseService.addClient(uid, subscriber);

			// Manejo de desconexión del cliente
			req.raw.on('close', () => {
				subscription.unsubscribe();
				this.sseService.removeClient(uid, subscriber);
				this.replyMap.delete(uid);
				this.onlineService.removeOnlineUser(req.accessToken);
				console.log(`Usuario ${uid} se ha desconectado`);
			});
		});
	}
}
