const { DataSource } = require('typeorm');
require('dotenv').config(); // Cargar variables de entorno desde .env

module.exports.AppDataSource = new DataSource({
	type: 'postgres', // Tipo de base de datos
	host: process.env.DB_HOST, // Host de la base de datos
	port: parseInt(process.env.DB_PORT || '5432', 10), // Puerto (convertido a número)
	username: process.env.DB_USERNAME, // Usuario
	password: process.env.DB_PASSWORD, // Contraseña
	database: process.env.DB_DATABASE, // Nombre de la base de datos
	entities: ['src/entities/**/*.js'], // Ruta a tus entidades (usa .js si es JavaScript)
	migrations: ['src/migrations/**/*.js'], // Ruta a tus migraciones (usa .js si es JavaScript)
	synchronize: false, // Desactiva synchronize en producción
	logging: true, // Habilita logs
});
