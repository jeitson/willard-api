import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { GetClientByDateResponse } from '../integrations/ph_central/dto/response.dto';

@Injectable()
export class ClientsCronService {
	private readonly logger = new Logger(ClientsCronService.name);

	constructor(
		@InjectRepository(Client)
		private readonly clientsRepository: Repository<Client>,
	) { }

	/**
	 * Guarda los clientes en la base de datos local.
	 *
	 * @param {Client[]} clients - Lista de clientes a guardar.
	 * @returns {Promise<void>}
	 */
	async saveClients(clients: GetClientByDateResponse[]): Promise<void> {
		try {
			await this.clientsRepository.save(clients.map(this.mapClientFromApi));
			this.logger.debug(`Clientes guardados: ${clients.length}`);
		} catch (error) {
			this.logger.error('Error al guardar clientes:', error);
			throw new Error('No se pudieron guardar los clientes');
		}
	}

	private mapClientFromApi(clientFromApi: GetClientByDateResponse): Client {
		const client = new Client();

		client.name = clientFromApi.primernombre || '';
		client.description = `${clientFromApi.primernombre} ${clientFromApi.segundonombre} ${clientFromApi.primerapellido} ${clientFromApi.segundoapellido}`.trim();
		client.businessName = clientFromApi.razonsocial || '';
		client.documentTypeId = parseInt(clientFromApi.TipoDocumento, 10) || 0;
		client.countryId = 1;
		client.documentNumber = clientFromApi.Documento || '';
		client.referenceWLL = clientFromApi.Oid || '';
		client.referencePH = clientFromApi.Oid || '';

		client.createdAt = new Date();
		client.updatedAt = new Date();

		return client;
	}
}
