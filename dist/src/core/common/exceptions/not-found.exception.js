"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotFindException = exports.NotFoundMessage = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
exports.NotFoundMessage = ['404, Not Found'];
class CannotFindException extends common_1.NotFoundException {
    constructor() {
        super((0, lodash_1.sample)(exports.NotFoundMessage));
    }
}
exports.CannotFindException = CannotFindException;
//# sourceMappingURL=not-found.exception.js.map