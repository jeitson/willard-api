import { Injectable } from '@nestjs/common';
import { Subscriber } from 'rxjs';
import { ROOT_ROLE_ID } from 'src/core/constants/system.constant';

import { RoleEntity } from 'src/modules/system/role/role.entity';
import { UserEntity } from 'src/modules/user/user.entity';

export interface MessageEvent {
	data?: string | number | object;
	id?: string;
	type?: 'ping' | 'close' | 'updatePermsAndMenus' | 'updateOnlineUserCount';
	retry?: number;
}

const clientMap: Map<string, Subscriber<MessageEvent>[]> = new Map();

@Injectable()
export class SseService {
	addClient(uid: string, subscriber: Subscriber<MessageEvent>) {
		const clients = clientMap.get(uid) || [];
		clientMap.set(uid, [...clients, subscriber]);
	}

	/** Remove and close specified user's client connections (handling multiple login scenario) */
	removeClient(uid: string, subscriber: Subscriber<MessageEvent>): void {
		const clients = clientMap.get(uid);
		if (clients) {
			const targetIndex = clients.findIndex(
				(client) => client === subscriber,
			);
			if (targetIndex !== -1) {
				const removedClient = clients.splice(targetIndex, 1)[0];
				if (removedClient) {
					removedClient.complete();
				}
			}
		}
	}

	/** Remove and close all connections of specified user */
	removeClients(uid: string): void {
		const clients = clientMap.get(uid);
		if (clients) {
			clients.forEach((client) => {
				client.complete();
			});
			clientMap.delete(uid);
		}
	}

	/** Send message to specified user's clients */
	sendToClients(uid: string, data: MessageEvent): void {
		const clients = clientMap.get(uid);
		if (clients) {
			clients.forEach((client) => {
				client.next?.(data);
			});
		}
	}

	/** Send message to all users */
	sendToAllUser(data: MessageEvent): void {
		clientMap.forEach((clients, uid) => {
			this.sendToClients(uid, data);
		});
	}

	/**
	 * Notify frontend to update permission menus by user IDs
	 * @param uid
	 */
	async noticeClientToUpdateMenusByUserIds(uid: string[]): Promise<void> {
		const userIds = Array.isArray(uid) ? uid : [uid];
		userIds.forEach((userId) => {
			this.sendToClients(userId, { type: 'updatePermsAndMenus' });
		});
	}

	/**
	 * Notify users to update permission menus by menu IDs
	 * @param menuIds
	 */
	async noticeClientToUpdateMenusByMenuIds(menuIds: string[]): Promise<void> {
		const roleMenus = await RoleEntity.createQueryBuilder('role')
			.where('role.menus IN (:...menuIds)', { menuIds })
			.getMany();
		const roleIds = roleMenus.map((role) => role.id).concat(ROOT_ROLE_ID);
		await this.noticeClientToUpdateMenusByRoleIds(roleIds);
	}

	/**
	 * Notify users to update permission menus by role IDs
	 * @param roleIds
	 */
	async noticeClientToUpdateMenusByRoleIds(roleIds: string[]): Promise<void> {
		const users = await UserEntity.createQueryBuilder('user')
			.where('user.roles IN (:...roleIds)', { roleIds })
			.getMany();
		const userIds = users.map((user) => user.id);
		await this.noticeClientToUpdateMenusByUserIds(userIds);
	}
}
