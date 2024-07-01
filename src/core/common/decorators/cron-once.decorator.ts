import cluster from 'node:cluster';

import { Cron } from '@nestjs/schedule';
import { isMainProcess } from 'src/core/global/env';


export const CronOnce: typeof Cron = (...rest): MethodDecorator => {
	if (isMainProcess)
		return Cron.call(null, ...rest);

	if (cluster.isWorker && cluster.worker?.id === 1)
		return Cron.call(null, ...rest);

	const returnNothing: MethodDecorator = () => {};
	return returnNothing;
};
