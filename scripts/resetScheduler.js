"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const cron_1 = require("cron");
const runMigrationGenerate = async function () {
    (0, node_child_process_1.exec)('npm run migration:revert && npm run migration:run', (error) => {
        if (!error)
            console.log('操作成功', error);
        else
            console.log('操作失败', error);
    });
};
const job = cron_1.CronJob.from({
    cronTime: '30 4 * * *',
    timeZone: 'Asia/Shanghai',
    start: true,
    onTick() {
        runMigrationGenerate();
        console.log('Task executed daily at 4.30 AM:', new Date().toLocaleTimeString());
    },
});
//# sourceMappingURL=resetScheduler.js.map