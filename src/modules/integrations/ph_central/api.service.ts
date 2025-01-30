import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AuthPHCentralDto } from './dto/auth.dto';
import { firstValueFrom } from 'rxjs';
import { CreateDocuments, GetDocumentsByDate } from './dto/create-document.dto';
import { CreateDocumentResponse, GetClientByDateResponse, GetDocumentResponse } from './dto/response.dto';
import { GetClientsByDate } from './dto/get-client.dto';

@Injectable()
export class ApiService {
	private readonly baseUrl = 'https://api.example.com';
	private token: string | null = null;
	private readonly logger = new Logger(ApiService.name);

	constructor(private readonly httpService: HttpService) { }

	/**
	 * Autentica con la API externa y almacena el token de acceso.
	 * Si `content` es proporcionado, se envían las credenciales personalizadas.
	 *
	 * @param {AuthPHCentralDto} [content] - Credenciales opcionales para autenticación.
	 * @throws {Error} Si la autenticación falla.
	 */
	async authenticate(content?: AuthPHCentralDto): Promise<void> {
		try {
			const response = await firstValueFrom(
				this.httpService.post(`${this.baseUrl}/Authentication/Authenticate`, content),
			);
			this.token = response.data.token;
			this.logger.log('Autenticación exitosa');
		} catch (error) {
			this.logger.error('Error en autenticación', error);
			throw new Error('Error de autenticación con la API externa');
		}
	}

	/**
	 * Asegura que el servicio esté autenticado antes de realizar una solicitud.
	 * Si el token no está presente, intenta autenticarse automáticamente.
	 */
	private async ensureAuthenticated(): Promise<void> {
		if (!this.token) {
			this.logger.warn('Token ausente, autenticando...');
			await this.authenticate();
		}
	}

	/**
	 * Crea un documento en la API externa.
	 *
	 * @param {CreateDocuments} content - Datos del documento a crear.
	 * @returns {Promise<CreateDocumentResponse>} Respuesta con la confirmación de creación.
	 * @throws {Error} Si la solicitud falla.
	 */
	async createDocument(content: CreateDocuments): Promise<CreateDocumentResponse> {
		await this.ensureAuthenticated();
		try {
			const response = await firstValueFrom(
				this.httpService.post(`${this.baseUrl}/creardocumentos`, content, {
					headers: this.getAuthHeaders(),
				}),
			);
			return response.data;
		} catch (error) {
			this.logger.error('Error al crear documento', error);
			throw new Error('No se pudo crear el documento');
		}
	}

	/**
	 * Obtiene documentos de la API externa según una fecha específica.
	 *
	 * @param {GetDocumentsByDate} content - Filtros de búsqueda por fecha.
	 * @returns {Promise<GetDocumentResponse>} Lista de documentos obtenidos.
	 * @throws {Error} Si la solicitud falla.
	 */
	async getDocuments(content: GetDocumentsByDate): Promise<GetDocumentResponse> {
		await this.ensureAuthenticated();
		try {
			const response = await firstValueFrom(
				this.httpService.post(`${this.baseUrl}/ObtenerDocumentos`, content, {
					headers: this.getAuthHeaders(),
				}),
			);
			return response.data;
		} catch (error) {
			this.logger.error('Error al obtener documentos', error);
			throw new Error('No se pudieron obtener los documentos');
		}
	}

	/**
	 * Obtiene clientes registrados en la API externa según una fecha específica.
	 *
	 * @param {GetClientsByDate} content - Filtros de búsqueda por fecha.
	 * @returns {Promise<GetClientByDateResponse[]>} Lista de clientes obtenidos.
	 * @throws {Error} Si la solicitud falla.
	 */
	async getClients(content: GetClientsByDate): Promise<GetClientByDateResponse[]> {
		await this.ensureAuthenticated();
		try {
			const response = await firstValueFrom(
				this.httpService.post(`${this.baseUrl}/obtenerClientes`, content, {
					headers: this.getAuthHeaders(),
				}),
			);
			return response.data;
		} catch (error) {
			this.logger.error('Error al obtener clientes', error);
			throw new Error('No se pudieron obtener los clientes');
		}
	}

	/**
	 * Devuelve los headers de autenticación con el token.
	 *
	 * @returns {Record<string, string>} Objeto con los headers de autorización.
	 */
	private getAuthHeaders(): Record<string, string> {
		return { Authorization: `Bearer ${this.token}` };
	}
}
