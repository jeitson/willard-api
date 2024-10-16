import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { env } from 'src/core/global/env';
import { UserContextService } from './user-context.service';

@Injectable()
export class Auth0Service {
	private auth0Domain: string;

	constructor(private readonly userContextService: UserContextService) {
		this.auth0Domain = env('AUTH0_DOMAIN');
	}

	async createUser(user: any): Promise<any> {
		const url = `https://${this.auth0Domain}/api/v2/users`;

		try {
			const response = await axios.post(url, user, {
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

	async updateUser(userId: string, userData: any): Promise<any> {
		const url = `https://${this.auth0Domain}/api/v2/users/${userId}`;

		try {
			const response = await axios.patch(url, userData, {
				headers: {
					Authorization: `Bearer ${this.userContextService.getToken()}`,
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
