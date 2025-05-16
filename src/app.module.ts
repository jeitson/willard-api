import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import config from './core/config';
import { SharedModule } from './core/shared/shared.module';
import { DatabaseModule } from './core/shared/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuditsModule } from './modules/audits/audits.module';
import { CatalogsModule } from './modules/catalogs/catalogs.module';
import { CollectionSitesModule } from './modules/collection_sites/collection_sites.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ProductsModule } from './modules/products/products.module';
import { TransportersModule } from './modules/transporters/transporters.module';
import { TransformInterceptor } from './core/common/interceptors/transform.interceptor';
import { TimeoutInterceptor } from './core/common/interceptors/timeout.interceptor';
import { PickUpLocationModule } from './modules/pick_up_location/pick_up_location.module';
import { CollectionRequestModule } from './modules/collection_request/collection_request.module';
import { CollectionRequestAuditsModule } from './modules/collection_request_audits/collection_request_audits.module';
import { RoutesModule } from './modules/routes/routes.module';
import { LoggingInterceptor } from './core/common/interceptors/logging.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './core/guards/jwt-auth.guard';
import { AllExceptionsFilter } from './core/filters/any-exception.filter';
import { DriversModule } from './modules/drivers/drivers.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReceptionsModule } from './modules/receptions/receptions.module';
import { TransporterTravelModule } from './modules/transporter_travel/transporter_travel.module';
import { FilesModule } from './modules/files/files.module';
import { ShipmentsModule } from './modules/shipments/shipments.module';
import { ReportsPhModule } from './modules/reports_ph/reports_ph.module';
import { HistoryJobsModule } from './modules/history_jobs/history_jobs.module';
import { AuditRouteModule } from './modules/audit_route/audit_route.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true,
			// Cuando se especifican varios archivos env, el primero tiene la prioridad más alta.
			envFilePath: ['.env'],
			load: [...Object.values(config)],
		}),
		SharedModule,
		DatabaseModule,
		UsersModule,
		RolesModule,
		AuditsModule,
		CatalogsModule,
		CollectionSitesModule,
		ClientsModule,
		ProductsModule,
		TransportersModule,
		PickUpLocationModule,
		CollectionRequestModule,
		CollectionRequestAuditsModule,
		RoutesModule,
		AuthModule,
		DriversModule,
		NotificationsModule,
		ReceptionsModule,
		TransporterTravelModule,
		FilesModule,
		ShipmentsModule,
		ReportsPhModule,
		HistoryJobsModule,
		AuditRouteModule,
		ReportsModule,
	],
	controllers: [],
	providers: [
		{ provide: APP_GUARD, useClass: JwtAuthGuard },
		{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
		{ provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
		{ provide: APP_INTERCEPTOR, useFactory: () => new TimeoutInterceptor(15 * 1000) },
		{ provide: APP_INTERCEPTOR, useClass: AllExceptionsFilter },
	],
})
export class AppModule { }
