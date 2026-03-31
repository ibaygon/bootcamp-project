const taskService = require('../services/task.service');

const getTasks = (req, res, next) => {
  try {
    const tasks = taskService.obtenerTodas();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

const createTask = (req, res, next) => {
  try {
    const { titulo, prioridad } = req.body;

    if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 3) {
      return res.status(400).json({ error: 'Título inválido' });
    }

    if (typeof prioridad !== 'number' || prioridad < 1) {
      return res.status(400).json({ error: 'Prioridad inválida' });
    }

    const nueva = taskService.crearTarea({ titulo, prioridad });
    res.status(201).json(nueva);
  } catch (err) {
    next(err);
  }
};

const deleteTask = (req, res, next) => {
  try {
    const { id } = req.params;
    taskService.eliminarTarea(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, createTask, deleteTask };
