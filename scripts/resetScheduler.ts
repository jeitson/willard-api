import { exec } from 'node:child_process';

import { CronJob } from 'cron';

const runMigrationGenerate = async function () {
	exec('npm run migration:revert && npm run migration:run', (error) => {
		if (!error) console.log('La operación fue un éxito.', error);
		else console.log('Fracaso de una operación', error);
	});
};

const job = CronJob.from({
	cronTime: '* * * * *',
	timeZone: 'America/Bogota',
	start: true,
	onTick() {
		runMigrationGenerate();
		console.log('Tarea ejecutada diariamente', new Date().toLocaleTimeString());
	},
});
