import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiService } from '../api.service';
import { ClientsService } from 'src/modules/clients/clients.service';
import { HistoryJobsService } from 'src/modules/history_jobs/history_jobs.service';
import { KEY_PROCESSES } from 'src/core/constants/key_processes.constant';

@Injectable()
export class TasksService {
	private readonly logger = new Logger(TasksService.name);
	constructor(
		private readonly apiService: ApiService,
		private clientsService: ClientsService,
		private historyJobsService: HistoryJobsService
	) { }

	@Cron(CronExpression.EVERY_HOUR)
	async syncDocuments() {
		// const documents = await this.apiService.getDocuments();
		console.log('Synced documents:', []);
	}

	@Cron(CronExpression.EVERY_30_SECONDS)
	async syncClients() {
		this.logger.debug('Called when the current second is 45');
		this.historyJobsService.create({
			description: 'DESCRIPCIÓN DE EJEMPLO',
			inputContent: [],
			key: KEY_PROCESSES['SYNC:CLIENT'],
			name: 'SINCRONIZACIÓN DE CLIENTES',
			outputContent: [],
		});
		// const clients = await this.apiService.getClients();
		console.log('Synced clients:', []);
	}
}
