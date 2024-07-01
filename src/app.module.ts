import { Module, OnModuleInit } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { ConfigModule } from '@nestjs/config';
import { SystemModule } from './modules/system/system.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import config from './core/config';
import { SharedModule } from './core/shared/shared.module';
import { DatabaseModule } from './core/shared/database/database.module';
import { SeederService } from './core/common/services/seeder/seeder.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true,
			// Cuando se especifican varios archivos env, el primero tiene la prioridad más alta.
			envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
			load: [...Object.values(config)],
		}),
		SystemModule,
		HealthModule,
		SharedModule,
		DatabaseModule,
		AuthModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		// SeederService,
	],
})
export class AppModule implements OnModuleInit {
	// constructor(private readonly seederService: SeederService) {}

	async onModuleInit() {
		// await this.seederService.seedInitialData();
	}
}