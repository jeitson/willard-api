"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchError = catchError;
function catchError() {
    process.on('unhandledRejection', (reason, p) => {
        console.log('Promise: ', p, 'Reason: ', reason);
    });
}
//# sourceMappingURL=catchError.js.map