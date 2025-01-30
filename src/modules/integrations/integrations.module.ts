import { Module } from '@nestjs/common';
import { ApiModule as ApiPHCentralModule } from './ph_central/api.module';

@Module({
	imports: [
		ApiPHCentralModule
	],
	controllers: [],
	providers: [],
})
export class IntegrationsModule {}
