let tasks = [];

function obtenerTodas() {
  return tasks;
}

function crearTarea(data) {
  const nueva = {
    id: Date.now().toString(),
    titulo: data.titulo,
    prioridad: data.prioridad,
  };
  tasks.push(nueva);
  return nueva;
}

function eliminarTarea(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    throw new Error('NOT_FOUND');
  }
  tasks.splice(index, 1);
}

module.exports = { obtenerTodas, crearTarea, eliminarTarea };
