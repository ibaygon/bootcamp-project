
const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const taskRoutes = require('./routes/task.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/v1/tasks', taskRoutes);

/**
 * ✅ Middleware global de manejo de errores (FASE C)
 * SIEMPRE debe ir después de las rutas
 */
app.use((err, req, res, next) => {

  // Errores semánticos de dominio
  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({
      error: 'Recurso no encontrado'
    });
  }

  // Errores no controlados
  console.error(err); // 👈 logging interno

  return res.status(500).json({
    error: 'Error interno del servidor'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
