const { DataSource } = require('typeorm');

module.exports.AppDataSource = new DataSource({
	type: 'postgres', // o postgres, sqlite, etc.
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: 'root',
	database: 'postgres',
	entities: ['src/entities/**/*.ts'], // Ruta a tus entidades
	// migrations: ['src/migrations/**/*.ts'], // Ruta a tus migraciones
	synchronize: false, // Desactiva synchronize en producción
	logging: true,
});
