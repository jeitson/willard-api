"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConfig = exports.dbRegToken = void 0;
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
const env_1 = require("../global/env");
dotenv.config({ path: `.env` });
const currentScript = process.env.npm_lifecycle_event;
const dataSourceOptions = {
    type: 'postgres',
    host: (0, env_1.env)('DB_HOST', '127.0.0.1'),
    port: (0, env_1.envNumber)('DB_PORT', 3306),
    username: (0, env_1.env)('DB_USERNAME'),
    password: (0, env_1.env)('DB_PASSWORD'),
    database: (0, env_1.env)('DB_DATABASE'),
    synchronize: (0, env_1.envBoolean)('DB_SYNCHRONIZE', false),
    logging: false,
    entities: ['dist/modules/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    subscribers: ['dist/modules/**/*.subscriber{.ts,.js}'],
    ssl: true
};
exports.dbRegToken = 'database';
exports.DatabaseConfig = (0, config_1.registerAs)(exports.dbRegToken, () => dataSourceOptions);
const dataSource = new typeorm_1.DataSource(dataSourceOptions);
exports.default = dataSource;
//# sourceMappingURL=database.config.js.map