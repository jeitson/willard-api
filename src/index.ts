import express from 'express';
import dotenv from 'dotenv';

// Configurar dotenv para cargar las variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/env-vars', (req, res) => {
    res.json(process.env);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
