"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResult = ApiResult;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const response_model_1 = require("../model/response.model");
const baseTypeNames = ['String', 'Number', 'Boolean'];
function genBaseProp(type) {
    if (baseTypeNames.includes(type.name))
        return { type: type.name.toLocaleLowerCase() };
    else
        return { $ref: (0, swagger_1.getSchemaPath)(type) };
}
function ApiResult({ type, isPage, status, }) {
    let prop = null;
    if (Array.isArray(type)) {
        if (isPage) {
            prop = {
                type: 'object',
                properties: {
                    items: {
                        type: 'array',
                        items: { $ref: (0, swagger_1.getSchemaPath)(type[0]) },
                    },
                    meta: {
                        type: 'object',
                        properties: {
                            itemCount: { type: 'number', default: 0 },
                            totalItems: { type: 'number', default: 0 },
                            itemsPerPage: { type: 'number', default: 0 },
                            totalPages: { type: 'number', default: 0 },
                            currentPage: { type: 'number', default: 0 },
                        },
                    },
                },
            };
        }
        else {
            prop = {
                type: 'array',
                items: genBaseProp(type[0]),
            };
        }
    }
    else if (type) {
        prop = genBaseProp(type);
    }
    else {
        prop = { type: 'null', default: null };
    }
    const model = Array.isArray(type) ? type[0] : type;
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(model), (0, swagger_1.ApiResponse)({
        status,
        schema: {
            allOf: [
                { $ref: (0, swagger_1.getSchemaPath)(response_model_1.ResOp) },
                {
                    properties: {
                        data: prop,
                    },
                },
            ],
        },
    }));
}
//# sourceMappingURL=api-result.decorator.js.map