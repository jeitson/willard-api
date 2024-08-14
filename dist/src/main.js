"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const setup_swagger_1 = require("./setup-swagger");
const env_1 = require("./core/global/env");
const logging_interceptor_1 = require("./core/common/interceptors/logging.interceptor");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        transformOptions: { enableImplicitConversion: true },
        errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
        stopAtFirstError: false,
        exceptionFactory: errors => {
            const errorMessages = errors.map(error => {
                const constraints = error.constraints
                    ? Object.values(error.constraints)
                    : [];
                return {
                    property: error.property,
                    errors: constraints,
                };
            });
            return new common_1.UnprocessableEntityException({
                message: 'Validation failed',
                errors: errorMessages,
            });
        },
    }));
    if (env_1.isDev)
        app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    (0, setup_swagger_1.setupSwagger)(app, configService);
    await app.listen((0, env_1.env)('PORT'));
}
bootstrap();
//# sourceMappingURL=main.js.map