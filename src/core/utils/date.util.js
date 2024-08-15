"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatToDateTime = formatToDateTime;
exports.formatToDate = formatToDate;
exports.isDateObject = isDateObject;
const dayjs_1 = require("dayjs");
const lodash_1 = require("lodash");
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';
function formatToDateTime(date = undefined, format = DATE_TIME_FORMAT) {
    return (0, dayjs_1.default)(date).format(format);
}
function formatToDate(date = undefined, format = DATE_FORMAT) {
    return (0, dayjs_1.default)(date).format(format);
}
function isDateObject(obj) {
    return (0, lodash_1.isDate)(obj) || dayjs_1.default.isDayjs(obj);
}
//# sourceMappingURL=date.util.js.map