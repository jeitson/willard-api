import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiService } from '../api.service';
import { HistoryJobsService } from 'src/modules/history_jobs/history_jobs.service';
import { KEY_PROCESSES } from 'src/core/constants/key_processes.constant';
import { ClientsCronService } from 'src/modules/clients/clients.cron.service';

@Injectable()
export class TasksService {
	private readonly logger = new Logger(TasksService.name);
	private readonly key_client = KEY_PROCESSES['SYNC:CLIENT'];

	constructor(
		private readonly apiService: ApiService,
		private readonly historyJobsService: HistoryJobsService,
		private readonly clientsCronService: ClientsCronService,
	) { }

	// @Cron(CronExpression.EVERY_30_SECONDS)
	async syncClients() {
		const now = new Date();
		const lastSuccessfulSync = await this.historyJobsService.getLastSuccessfulSync(this.key_client);
		const startTime = lastSuccessfulSync || new Date(now.getTime() - 60 * 60 * 1000);
		const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

		const adjustedEndTime = endTime > now ? now : endTime;

		this.logger.debug(`Sincronizando clientes desde ${startTime} hasta ${adjustedEndTime}...`);

		const content = {
			fechaInicio: startTime,
			fechaFin: adjustedEndTime,
		};

		try {
			const clients = await this.apiService.getClients(content);

			if (clients.length > 0) {
				this.logger.debug(`Clientes obtenidos: ${clients.length}`);

				await this.clientsCronService.saveClients(clients);

				this.historyJobsService.create({
					description: `Sincronización exitosa de clientes desde ${startTime} hasta ${adjustedEndTime}`,
					inputContent: content,
					key: this.key_client,
					name: 'SINCRONIZACIÓN DE CLIENTES',
					outputContent: clients,
					statusProcess: 'SUCCESS',
				});
			} else {
				this.logger.debug('No hay clientes para sincronizar en este intervalo.');

				this.historyJobsService.create({
					description: `No hubo clientes para sincronizar desde ${startTime} hasta ${adjustedEndTime}`,
					inputContent: content,
					key: this.key_client,
					name: 'SINCRONIZACIÓN DE CLIENTES',
					outputContent: [],
					statusProcess: 'SUCCESS',
				});
			}
		} catch (error) {
			this.logger.error(`Error durante la sincronización de clientes: ${error.message}`);

			this.historyJobsService.create({
				description: `Error al sincronizar clientes desde ${startTime} hasta ${adjustedEndTime}: ${error.message}`,
				inputContent: content,
				key: this.key_client,
				name: 'SINCRONIZACIÓN DE CLIENTES',
				outputContent: error,
				statusProcess: 'FAILED',
			});
		}
	}
}
