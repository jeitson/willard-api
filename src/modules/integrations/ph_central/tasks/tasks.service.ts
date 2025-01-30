import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiService } from '../api.service';
import { ClientsService } from 'src/modules/clients/clients.service';

@Injectable()
export class TasksService {
	constructor(private readonly apiService: ApiService, private clientsService: ClientsService) { }

	@Cron(CronExpression.EVERY_HOUR)
	async syncDocuments() {
		// const documents = await this.apiService.getDocuments();
		console.log('Synced documents:', []);
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async syncClients() {
		// const clients = await this.apiService.getClients();
		console.log('Synced clients:', []);
	}
}
