import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AuthPHCentralDto } from './dto/auth.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApiService {

	private baseUrl = 'https://api.example.com';

	constructor(private readonly httpService: HttpService) { }

	async authenticate(): Promise<string> {
		const response = await firstValueFrom(
			this.httpService.post(`${this.baseUrl}/login`, {
				username: 'yourUsername',
				password: 'yourPassword',
			}),
		);
		return response.data.token;
	}

	async createDocument(token: string, documentData: any): Promise<any> {
		return firstValueFrom(
			this.httpService.post(`${this.baseUrl}/documents`, documentData, {
				headers: { Authorization: `Bearer ${token}` },
			}),
		);
	}

	// Obtener documentos
	async getDocuments(token: string): Promise<any> {
		return firstValueFrom(
			this.httpService.get(`${this.baseUrl}/documents`, {
				headers: { Authorization: `Bearer ${token}` },
			}),
		);
	}

	// Obtener clientes
	async getClients(token: string): Promise<any> {
		return firstValueFrom(
			this.httpService.get(`${this.baseUrl}/clients`, {
				headers: { Authorization: `Bearer ${token}` },
			}),
		);
	}
}
