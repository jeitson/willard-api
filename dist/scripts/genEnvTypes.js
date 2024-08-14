"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const dotenv_1 = require("dotenv");
const directoryPath = node_path_1.default.resolve(__dirname, '..');
const targets = ['.env'];
const envObj = targets.reduce((prev, file) => {
    const result = dotenv_1.default.parse(node_fs_1.default.readFileSync(node_path_1.default.join(directoryPath, file)));
    return { ...prev, ...result };
}, {});
const envType = Object.entries(envObj)
    .reduce((prev, [key, value]) => {
    return `${prev}
      ${key}: '${value}';`;
}, '')
    .trim();
node_fs_1.default.writeFile(node_path_1.default.join(directoryPath, 'types/env.d.ts'), `
// generate by ./scripts/generateEnvTypes.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ${envType}
    }
  }
}
export {};
  `, (err) => {
    if (err)
        console.log('生成 env.d.ts 文件失败');
    else
        console.log('成功生成 env.d.ts 文件');
});
//# sourceMappingURL=genEnvTypes.js.map