const dotenv = require('dotenv');

// Cargar las variables del archivo .env
dotenv.config();

// Validación: si PORT no existe, no inicia el servidor
if (!process.env.PORT) {
  throw new Error('El puerto no está definido en el archivo .env');
}

// Exporta las variables para usarlas en index.js
module.exports = {
  PORT: process.env.PORT,
};
