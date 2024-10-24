import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { env } from 'src/core/global/env';
import { UserContextService } from './user-context.service';

interface UserDto {
	email: string;
	phone_number: string;
	user_metadata?: any;
	app_metadata?: any;
	given_name: string;
	family_name: string;
	name: string;
	nickname: string;
	password?: string;
	username: string;
}

@Injectable()
export class Auth0Service {
	private auth0Domain: string;

	constructor(private readonly userContextService: UserContextService) {
		this.auth0Domain = env('AUTH0_DOMAIN');
	}

	async createUser(user: UserDto): Promise<any> {
		const url = `https://${this.auth0Domain}/api/v2/users`;

		try {
			const response = await axios.post(url, { ...user, connection: "Username-Password-Authentication", client_id: "WZNm59oARsrlUlcSjdDrxqRfM6DtmqSz", picture: "https://cafeplatino.com/wp-content/uploads/2023/05/imagen-de-prueba-320x240-1.jpeg" }, {
				headers: {
					Authorization: `Bearer ${this.userContextService.getToken()}`,
				},
			});

			return response.data;
		} catch (error) {
			this.handleAxiosError(error, 'Error creating user');
		}
	}

	async getUser(userId: string): Promise<any> {
		const url = `https://${this.auth0Domain}/api/v2/users/${userId}`;

		try {
			const response = await axios.get(url, {
				headers: {
					Authorization: `Bearer ${this.userContextService.getToken()}`,
				},
			});

			return response.data;
		} catch (error) {
			this.handleAxiosError(error, 'Error retrieving user');
		}
	}

	async updateUser(userId: string, userData: UserDto): Promise<any> {
		const url = `https://${this.auth0Domain}/api/v2/users/${userId}`;

		try {
			const data = { ...userData, connection: "Username-Password-Authentication", client_id: "WZNm59oARsrlUlcSjdDrxqRfM6DtmqSz", picture: "https://cafeplatino.com/wp-content/uploads/2023/05/imagen-de-prueba-320x240-1.jpeg" };

			const Authorization = `Bearer ${this.userContextService.getToken()}`;

			console.log(Authorization);

			const response = await axios.patch(url, data, {
				headers: {
					Authorization,
				},
			});

			return response.data;
		} catch (error) {
			this.handleAxiosError(error, 'Error updating user');
		}
	}

	async deleteUser(userId: string): Promise<any> {
		const url = `https://${this.auth0Domain}/api/v2/users/${userId}`;

		try {
			await axios.delete(url, {
				headers: {
					Authorization: `Bearer ${this.userContextService.getToken()}`,
				},
			});

			return { message: 'User deleted successfully' };
		} catch (error) {
			this.handleAxiosError(error, 'Error deleting user');
		}
	}

	async listUsers(): Promise<any[]> {
		const url = `https://${this.auth0Domain}/api/v2/users`;

		try {
			const response = await axios.get(url, {
				headers: {
					Authorization: `Bearer ${this.userContextService.getToken()}`,
				},
			});

			return response.data;
		} catch (error) {
			this.handleAxiosError(error, 'Error listing users');
		}
	}

	private handleAxiosError(error: any, customMessage: string): void {
		if (error.response) {
			const status = error.response.status;
			const message = error.response.data?.message || error.response.statusText || 'Unknown error';
			throw new BadRequestException(`${customMessage}: ${message} (Status: ${status})`);
		} else if (error.request) {
			throw new InternalServerErrorException(`${customMessage}: No response from Auth0`);
		} else {
			throw new InternalServerErrorException(`${customMessage}: ${error.message}`);
		}
	}
}
