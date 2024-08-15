"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aesEncrypt = aesEncrypt;
exports.aesDecrypt = aesDecrypt;
exports.md5 = md5;
const CryptoJS = require("crypto-js");
const key = CryptoJS.enc.Utf8.parse('buqiyuanabcdefe9bc');
const iv = CryptoJS.enc.Utf8.parse('0123456789buqiyuan');
function aesEncrypt(data) {
    if (!data)
        return data;
    const enc = CryptoJS.AES.encrypt(data, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return enc.toString();
}
function aesDecrypt(data) {
    if (!data)
        return data;
    const dec = CryptoJS.AES.decrypt(data, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return dec.toString(CryptoJS.enc.Utf8);
}
function md5(str) {
    return CryptoJS.MD5(str).toString();
}
//# sourceMappingURL=crypto.util.js.map