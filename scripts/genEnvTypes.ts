import fs from 'node:fs';
import path from 'node:path';

import dotenv from 'dotenv';

const directoryPath = path.resolve(__dirname, '..');

const targets = ['.env'];

const envObj = targets.reduce((prev, file) => {
	const result = dotenv.parse(
		fs.readFileSync(path.join(directoryPath, file)),
	);
	return { ...prev, ...result };
}, {});

const envType = Object.entries<string>(envObj)
	.reduce((prev, [key, value]) => {
		return `${prev}
      ${key}: '${value}';`;
	}, '')
	.trim();

fs.writeFile(
	path.join(directoryPath, 'types/env.d.ts'),
	`
// generate by ./scripts/generateEnvTypes.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ${envType}
    }
  }
}
export {};
  `,
	(err) => {
		if (err) console.log('Error al generar el archivo env.d.ts');
		else console.log('Archivo env.d.ts generado correctamente');
	},
);
