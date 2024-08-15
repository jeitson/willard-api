import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigKeyPaths } from './core/config';
export declare function setupSwagger(app: INestApplication, configService: ConfigService<ConfigKeyPaths>): void;
