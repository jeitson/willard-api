import { Logger } from '@nestjs/common';
import { Logger as ITypeORMLogger, LoggerOptions } from 'typeorm';

// Clase que implementa la interfaz de registro de TypeORM
export class TypeORMLogger implements ITypeORMLogger {
	private logger = new Logger(TypeORMLogger.name);

	constructor(private options: LoggerOptions) {}

	// Método para registrar una consulta SQL
	logQuery(query: string, parameters?: any[]) {
		if (!this.isEnable('query')) return;

		const sql =
			query +
			(parameters && parameters.length
				? ` -- PARÁMETROS: ${this.stringifyParams(parameters)}`
				: '');

		this.logger.log(`[CONSULTA]: ${sql}`);
	}

	// Método para registrar un error en una consulta SQL
	logQueryError(error: string | Error, query: string, parameters?: any[]) {
		if (!this.isEnable('error')) return;

		const sql =
			query +
			(parameters && parameters.length
				? ` -- PARÁMETROS: ${this.stringifyParams(parameters)}`
				: '');

		this.logger.error([
			`[CONSULTA FALLIDA]: ${sql}`,
			`[ERROR EN CONSULTA]: ${error}`,
		]);
	}

	// Método para registrar una consulta lenta
	logQuerySlow(time: number, query: string, parameters?: any[]) {
		const sql =
			query +
			(parameters && parameters.length
				? ` -- PARÁMETROS: ${this.stringifyParams(parameters)}`
				: '');

		this.logger.warn(`[CONSULTA LENTA: ${time} ms]: ${sql}`);
	}

	// Método para registrar la construcción de un esquema
	logSchemaBuild(message: string) {
		if (!this.isEnable('schema')) return;

		this.logger.log(message);
	}

	// Método para registrar una migración
	logMigration(message: string) {
		if (!this.isEnable('migration')) return;

		this.logger.log(message);
	}

	// Método para registrar mensajes con diferentes niveles de gravedad
	log(level: 'warn' | 'info' | 'log', message: any) {
		if (!this.isEnable(level)) return;

		switch (level) {
			case 'log':
				this.logger.debug(message);
				break;
			case 'info':
				this.logger.log(message);
				break;
			case 'warn':
				this.logger.warn(message);
				break;
			default:
				break;
		}
	}

	/**
	 * Convierte los parámetros en una cadena.
	 * A veces los parámetros pueden contener objetos circulares, por lo que manejamos este caso también.
	 */
	private stringifyParams(parameters: any[]) {
		try {
			return JSON.stringify(parameters);
		} catch (error) {
			// Probablemente hay objetos circulares en los parámetros
			return parameters;
		}
	}

	/**
	 * Comprueba si el registro está habilitado para el nivel dado
	 */
	private isEnable(
		level:
			| 'query'
			| 'schema'
			| 'error'
			| 'warn'
			| 'info'
			| 'log'
			| 'migration',
	): boolean {
		return (
			this.options === 'all' ||
			this.options === true ||
			(Array.isArray(this.options) && this.options.includes(level))
		);
	}
}
