"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueSlash = exports.hashString = void 0;
exports.generateUUID = generateUUID;
exports.generateShortUUID = generateShortUUID;
exports.generateRandomValue = generateRandomValue;
exports.randomValue = randomValue;
const uuid_1 = require("uuid");
function generateUUID() {
    return (0, uuid_1.v4)().toString();
}
function generateShortUUID() {
    return (0, uuid_1.v4)().toString();
}
function generateRandomValue() {
    const customNanoid = (0, uuid_1.v4)();
    return customNanoid;
}
function randomValue(size = 16, dict = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict') {
    let id = '';
    let i = size;
    const len = dict.length;
    while (i--)
        id += dict[(Math.random() * len) | 0];
    return id;
}
const hashString = function (str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed;
    let h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 =
        Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
            Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 =
        Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
            Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
exports.hashString = hashString;
const uniqueSlash = (path) => path.replace(/(https?:\/)|(\/)+/g, '$1$2');
exports.uniqueSlash = uniqueSlash;
//# sourceMappingURL=tool.util.js.map