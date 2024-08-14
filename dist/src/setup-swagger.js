"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const response_model_1 = require("./core/common/model/response.model");
function setupSwagger(app, configService) {
    const { name, port } = configService.get('app');
    const { enable, path } = configService.get('swagger');
    if (!enable)
        return;
    const documentBuilder = new swagger_1.DocumentBuilder()
        .setTitle(name)
        .setDescription(`${name} API document`)
        .setVersion('1.0');
    const document = swagger_1.SwaggerModule.createDocument(app, documentBuilder.build(), {
        ignoreGlobalPrefix: false,
        extraModels: [response_model_1.ResOp, response_model_1.TreeResult],
    });
    swagger_1.SwaggerModule.setup(path, app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    const logger = new common_1.Logger('SwaggerModule');
    logger.log(`Document running on http://127.0.0.1:${port}/${path}`);
}
//# sourceMappingURL=setup-swagger.js.map