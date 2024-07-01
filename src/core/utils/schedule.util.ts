const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function scheduleMicrotask(callback: () => void) {
	sleep(0).then(callback);
}

type NotifyCallback = () => void;

type NotifyFunction = (callback: () => void) => void;

type BatchNotifyFunction = (callback: () => void) => void;

export function createNotifyManager() {
	let queue: NotifyCallback[] = [];
	let transactions = 0;
	let notifyFn: NotifyFunction = (callback) => {
		callback();
	};
	let batchNotifyFn: BatchNotifyFunction = (callback: () => void) => {
		callback();
	};

	const flush = (): void => {
		const originalQueue = queue;
		queue = [];
		if (originalQueue.length) {
			scheduleMicrotask(() => {
				batchNotifyFn(() => {
					originalQueue.forEach((callback) => {
						notifyFn(callback);
					});
				});
			});
		}
	};

	const batch = <T>(callback: () => T): T => {
		let result;
		transactions++;
		try {
			result = callback();
		} finally {
			transactions--;
			if (!transactions) flush();
		}
		return result;
	};

	const schedule = (callback: NotifyCallback): void => {
		if (transactions) {
			queue.push(callback);
		} else {
			scheduleMicrotask(() => {
				notifyFn(callback);
			});
		}
	};

	/**
	 * Todas las llamadas a la función envuelta se agruparán.
	 */
	const batchCalls = <T extends Function>(callback: T): T => {
		return ((...args: any[]) => {
			schedule(() => {
				callback(...args);
			});
		}) as any;
	};

	/**
	 * Utilice este método para establecer una función de notificación personalizada.
	 * Esto puede ser usado para, por ejemplo, envolver notificaciones con `React.act` mientras se ejecutan pruebas.
	 */
	const setNotifyFunction = (fn: NotifyFunction) => {
		notifyFn = fn;
	};

	/**
	 * Utiliza este método para establecer una función personalizada para agrupar las notificaciones en un único tick.
	 * Por defecto, React Query utilizará la función de lote proporcionada por ReactDOM o React Native.
	 */
	const setBatchNotifyFunction = (fn: BatchNotifyFunction) => {
		batchNotifyFn = fn;
	};

	return {
		batch,
		batchCalls,
		schedule,
		setNotifyFunction,
		setBatchNotifyFunction,
	} as const;
}

// SINGLETON
export const scheduleManager = createNotifyManager();
