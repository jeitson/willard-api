import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
	DiskHealthIndicator,
	HealthCheck,
	HttpHealthIndicator,
	MemoryHealthIndicator,
	TypeOrmHealthIndicator,
} from '@nestjs/terminus';

import {
	Perm,
	definePermission,
} from '../auth/decorators/permission.decorator';
import * as path from 'path';

export const PermissionHealth = definePermission('app:health', {
	NETWORK: 'network',
	DB: 'database',
	MH: 'memory-heap',
	MR: 'memory-rss',
	DISK: 'disk',
} as const);

@ApiTags('Salud - Verificación')
@Controller('health')
export class HealthController {
	constructor(
		private http: HttpHealthIndicator,
		private db: TypeOrmHealthIndicator,
		private memory: MemoryHealthIndicator,
		private disk: DiskHealthIndicator,
	) {}

	@Get('network')
	@HealthCheck()
	@Perm(PermissionHealth.NETWORK)
	async checkNetwork() {
		return this.http.pingCheck('google', 'https://google.com/');
	}

	@Get('database')
	@HealthCheck()
	@Perm(PermissionHealth.DB)
	async checkDatabase() {
		return this.db.pingCheck('database');
	}

	@Get('memory-heap')
	@HealthCheck()
	@Perm(PermissionHealth.MH)
	async checkMemoryHeap() {
		// El proceso no debería usar más de 200MB de memoria
		return this.memory.checkHeap('memory-heap', 200 * 1024 * 1024);
	}

	@Get('memory-rss')
	@HealthCheck()
	@Perm(PermissionHealth.MR)
	async checkMemoryRSS() {
		// El proceso no debería tener más de 200MB de memoria RSS asignada
		return this.memory.checkRSS('memory-rss', 200 * 1024 * 1024);
	}

	@Get('disk')
	@HealthCheck()
	@Perm(PermissionHealth.DISK)
	async checkDisk() {
		return this.disk.checkStorage('disk', {
			// El almacenamiento de disco utilizado no debe superar el 75% del tamaño total del disco
			thresholdPercent: 0.75,
			path: path.dirname(__dirname),
		});
	}
}
