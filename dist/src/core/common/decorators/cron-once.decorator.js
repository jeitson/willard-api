"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronOnce = void 0;
const node_cluster_1 = require("node:cluster");
const schedule_1 = require("@nestjs/schedule");
const env_1 = require("../../global/env");
const CronOnce = (...rest) => {
    if (env_1.isMainProcess)
        return schedule_1.Cron.call(null, ...rest);
    if (node_cluster_1.default.isWorker && node_cluster_1.default.worker?.id === 1)
        return schedule_1.Cron.call(null, ...rest);
    const returnNothing = () => { };
    return returnNothing;
};
exports.CronOnce = CronOnce;
//# sourceMappingURL=cron-once.decorator.js.map