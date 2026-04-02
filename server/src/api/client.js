const API_URL = "http://localhost:3000/api/v1/tasks";

/**
 * Convierte prioridad UI -> API.
 * @param {"alta"|"media"|"baja"} priority
 * @returns {number}
 */
function mapPriorityToApi(priority) {
  if (priority === "alta") return 3;
  if (priority === "baja") return 1;
  return 2;
}

/**
 * Convierte prioridad API -> UI.
 * @param {number} priority
 * @returns {"alta"|"media"|"baja"}
 */
function mapPriorityFromApi(priority) {
  if (priority >= 3) return "alta";
  if (priority <= 1) return "baja";
  return "media";
}

/**
 * Normaliza la respuesta del backend para la UI actual.
 * @param {{id:string, titulo:string, prioridad:number}} task
 */
function mapApiTaskToUiTask(task) {
  return {
    id: String(task.id),
    title: String(task.titulo || ""),
    completed: false,
    createdAt: new Date().toISOString(),
    priority: mapPriorityFromApi(Number(task.prioridad))
  };
}

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function buildHttpError(response, fallbackMessage, body) {
  const message =
    body?.error ||
    `${fallbackMessage} (HTTP ${response.status})`;
  return new Error(message);
}

export async function fetchTasksApi() {
  const response = await fetch(API_URL);
  const body = await parseJsonSafely(response);

  if (!response.ok) {
    throw buildHttpError(response, "No se pudieron cargar las tareas", body);
  }

  if (!Array.isArray(body)) {
    throw new Error("Respuesta del servidor invalida");
  }

  return body.map(mapApiTaskToUiTask);
}

export async function createTaskApi(title, priority) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: title,
      prioridad: mapPriorityToApi(priority)
    })
  });

  const body = await parseJsonSafely(response);
  if (!response.ok) {
    throw buildHttpError(response, "No se pudo crear la tarea", body);
  }

  return mapApiTaskToUiTask(body);
}

export async function deleteTaskApi(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  const body = await parseJsonSafely(response);

  if (!response.ok) {
    throw buildHttpError(response, "No se pudo eliminar la tarea", body);
  }
}
