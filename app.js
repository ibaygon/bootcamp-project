/**
 * Guarda las tareas en LocalStorage usando `JSON.stringify`.
 * @returns {void}
 */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/**
 * Recupera las tareas desde LocalStorage usando `JSON.parse`.
 * Si no hay datos, inicializa `tasks` como array vacío.
 * @returns {void}
 */
function loadTasks() {
  const stored = localStorage.getItem("tasks");
  const rawTasks = stored ? JSON.parse(stored) : [];

  // Compatibilidad: si hay tareas antiguas sin priority, se añade "media".
  tasks = Array.isArray(rawTasks)
    ? rawTasks.map(t => ({ ...t, priority: normalizePriority(t?.priority) }))
    : [];
}

// 9.5 Guarda la preferencia del usuario en LocalStorage
 
if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
}

document.getElementById("toggle-dark").addEventListener("click", () => {
    const html = document.documentElement;

    html.classList.toggle("dark");

    if (html.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});



// 6.1 Crea el archivo app.js
let tasks = [];
let currentFilter = "all"; 
let currentPriorityFilter = "all";
let currentSort = "date";

/**
 * Normaliza una prioridad para que siempre sea: "alta" | "media" | "baja".
 * @param {unknown} priority
 * @returns {"alta"|"media"|"baja"}
 */
function normalizePriority(priority) {
  const p = (typeof priority === "string" ? priority : "").toLowerCase();
  if (p === "alta" || p === "media" || p === "baja") return p;
  return "media";
}

/**
 * Devuelve texto y clases Tailwind para cada prioridad.
 * @param {"alta"|"media"|"baja"} priority
 * @returns {{label: string, className: string}}
 */
function getPriorityMeta(priority) {
  const p = normalizePriority(priority);
  if (p === "alta") {
    return { label: "Alta", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" };
  }
  if (p === "baja") {
    return { label: "Baja", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" };
  }
  return { label: "Media", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" };
}



/**
 * Obtiene un elemento del DOM por `id`.
 * @param {string} id
 * @returns {HTMLElement | null}
 */
function getEl(id) {
  return document.getElementById(id);
}

/**
 * Genera un id único basado en el timestamp actual.
 * @returns {string}
 */
function generateId() {
  return Date.now().toString();
}



// 6.2 Define la estructura de una tarea como un objeto con id, title, completed y createdAt
/**
 * Crea una tarea nueva con un `id` único, texto y estado inicial `completed=false`.
 * @param {string} title
 * @param {"alta"|"media"|"baja"} [priority]
 * @returns {{id: string, title: string, completed: boolean, createdAt: string, priority: "alta"|"media"|"baja"}}
 */
function createTask(title, priority = "media") {
  return {
    id: generateId(),
    title: title,
    completed: false,
    createdAt: new Date().toISOString(),
    priority: normalizePriority(priority)
  };
}



// 6.3 Implementa la funcionalidad para añadir nuevas tareas
/**
 * Añade una tarea al estado global, persiste en LocalStorage y actualiza UI/estadísticas.
 * @param {string} title
 * @param {"alta"|"media"|"baja"} priority
 * @returns {void}
 */
function addTask(title, priority) {
  const newTask = createTask(title, priority);
  tasks.push(newTask);
  saveTasks(); 
  renderTasks();
  updateStats();
}


// 6.4 Renderiza las tareas en el DOM
/**
 * Renderiza la lista de tareas aplicando filtros y búsqueda.
 * @returns {void}
 */
function renderTasks() {
  const list = document.getElementById("tasks");
  const template = document.getElementById("task-template");
  list.innerHTML = "";

  const filteredTasks = getFilteredTasks();
  const visibleTasks = sortTasks(currentSort, filteredTasks);

  visibleTasks.forEach(task => {
    const { clone, li, checkbox, text, deleteBtn } = createTaskElement(task, template);
    attachTaskEventHandlers(task, { li, checkbox, text, deleteBtn });

    // Animación crear
    list.appendChild(clone);
    requestAnimationFrame(() => {
      li.classList.remove("opacity-0", "translate-y-2");
    });
  });

}



/**
 * Lee el texto de búsqueda del input y lo normaliza a minúsculas.
 * @returns {string}
 */
function getSearchText() {
  return document.getElementById("search")?.value.toLowerCase() || "";
}

/**
 * Aplica el filtro de pestaña (`currentFilter`) y la búsqueda por texto sobre `tasks`.
 * @returns {Array}
 */
function getFilteredTasks() {
  let filtered = tasks;

  // Filtro por pestaña: todas, pendientes y completadas
  if (currentFilter === "pending") {
    filtered = filtered.filter(t => !t.completed);
  } else if (currentFilter === "completed") {
    filtered = filtered.filter(t => t.completed);
  }

  // Filtro por prioridad (opcional)
  if (currentPriorityFilter !== "all") {
    filtered = filtered.filter(t => normalizePriority(t.priority) === currentPriorityFilter);
  }

  // Búsqueda por texto en las tareas
  const searchText = getSearchText();
  return filtered.filter(task =>
    task.title.toLowerCase().includes(searchText)
  );
}

/**
 * Ordena tareas sin modificar los datos originales (devuelve un array nuevo).
 * criteria: "date" | "name" | "priority"
 * @param {"date"|"name"|"priority"} criteria
 * @param {Array<{title: string, createdAt: string, priority?: string}>} tasksToSort
 * @returns {Array}
 */
function sortTasks(criteria, tasksToSort) {
  const list = Array.isArray(tasksToSort) ? [...tasksToSort] : [];

  const priorityRank = (p) => {
    const pr = normalizePriority(p);
    if (pr === "alta") return 0;
    if (pr === "media") return 1;
    return 2; // baja
  };

  if (criteria === "name") {
    return list.sort((a, b) => a.title.localeCompare(b.title, "es", { sensitivity: "base" }));
  }

  if (criteria === "priority") {
    return list.sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
  }

  // "date" (por defecto): más recientes primero
  return list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

/**
 * Crea (clona) el nodo DOM de una tarea usando el template y rellena sus campos.
 * @param {object} task
 * @param {HTMLTemplateElement} template
 * @returns {{clone: DocumentFragment, li: Element, checkbox: HTMLInputElement, text: Element, deleteBtn: HTMLButtonElement}}
 */
function createTaskElement(task, template) {
  const clone = template.content.cloneNode(true);

  const li = clone.querySelector("li");
  const checkbox = clone.querySelector(".task-check");
  const text = clone.querySelector(".task-text");
  const priorityEl = clone.querySelector(".task-priority");
  const deleteBtn = clone.querySelector(".delete-btn");

  text.textContent = task.title;
  checkbox.checked = task.completed;

  if (priorityEl) {
    const meta = getPriorityMeta(task.priority);
    priorityEl.textContent = meta.label;
    priorityEl.className = `task-priority px-2 py-1 text-xs font-semibold rounded ${meta.className}`;
  }

  return { clone, li, checkbox, text, deleteBtn };
}

/**
 * Asigna listeners (editar, marcar completada, eliminar) a los elementos de la tarea.
 * @param {object} task
 * @param {{li: Element, checkbox: HTMLInputElement, text: Element, deleteBtn: HTMLButtonElement}} elements
 * @returns {void}
 */
function attachTaskEventHandlers(task, { li, checkbox, text, deleteBtn }) {
  // Permite editar el título de una tarea existente
  text.addEventListener("dblclick", () => {
    const newTitle = prompt("Editar tarea:", task.title);
    if (newTitle && newTitle.trim() !== "") {
      editarTareaPorId(task.id, newTitle.trim());
    }
  });

  // Permite marcar tareas como completadas
  checkbox.addEventListener("change", () => toggleTask(task.id));

  // Animación + eliminar
  deleteBtn.addEventListener("click", () => {
    const ok = confirm("¿Seguro que quieres borrar esta tarea?");
    if (!ok) return;

    li.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => {
      deleteTask(task.id);
    }, 300);
  });
}


// 6.5 Permite marcar tareas como completadas
/**
 * Alterna `completed` de una tarea por `id` y refresca UI/estadísticas.
 * @param {string} id
 * @returns {void}
 */
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks(); 
  renderTasks();
  updateStats();
}

/**
 * Edita el título de una tarea buscando por `id`.
 * @param {string} id
 * @param {string} nuevoTitulo
 * @returns {boolean} `true` si se editó, `false` si no se encontró o el título es inválido.
 */
function editarTareaPorId(id, nuevoTitulo) {
  // 1) Buscar la tarea por su id
  const task = tasks.find(t => t.id === id);
  if (!task) return false;

  // 2) Actualizar su título
  const title = (nuevoTitulo ?? "").trim();
  if (title === "") return false;
  task.title = title;

  // 3) Guardar los cambios en localStorage
  saveTasks();

  // 4) Volver a renderizar la lista
  renderTasks();
  updateStats();

  return true;
}

// 6.6 Permite eliminar tareas
/**
 * Elimina la tarea indicada y refresca UI/estadísticas.
 * @param {string} id
 * @returns {void}
 */
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks(); 
  renderTasks();
  updateStats();
}


// 6.7 Actualiza las estadísticas cuando cambien las tareas
/**
 * Calcula estadísticas sobre una lista de tareas.
 * @param {Array<{completed: boolean}>} tasksToMeasure
 * @returns {{total: number, completed: number, pending: number}}
 */
function getStats(tasksToMeasure) {
  const total = tasksToMeasure.length;
  const completed = tasksToMeasure.filter(t => t.completed).length;
  const pending = total - completed;

  return { total, completed, pending };
}

/**
 * Actualiza los valores del panel de estadísticas en el DOM.
 * @returns {void}
 */
function updateStats() {
  const { total, completed, pending } = getStats(tasks);

  document.getElementById("total").textContent = total;
  document.getElementById("completed").textContent = completed;
  document.getElementById("pending").textContent = pending;
}



/**
 * Registra el submit del formulario para añadir nuevas tareas.
 * @returns {void}
 */
function setupTaskForm() {
  const form = getEl("task-form");
  const input = getEl("task-input");
  const prioritySelect = getEl("task-priority");
  if (!form || !input || !prioritySelect) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = input.value.trim();
    if (title === "") return;

    const priority = normalizePriority(prioritySelect.value);
    addTask(title, priority);
    input.value = "";
  });
}

/**
 * Muestra y actualiza el contador de caracteres del input.
 * @returns {void}
 */
function setupCharCounter() {
  const input = getEl("task-input");
  const counter = getEl("char-counter");
  if (!input || !counter) return;

  const max = Number(input.getAttribute("maxlength")) || 50;

  const render = () => {
    const len = (input.value || "").length;
    counter.textContent = `${len}/${max} caracteres`;
  };

  render();
  input.addEventListener("input", render);
}

/**
 * Registra el comportamiento de los botones de filtro.
 * @returns {void}
 */
function setupFilters() {
  document.querySelectorAll("#filters button").forEach(btn => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });
}

/**
 * Registra la búsqueda incremental por texto.
 * @returns {void}
 */
function setupSearch() {
  const search = getEl("search");
  search?.addEventListener("input", renderTasks);
}

/**
 * Registra el filtro por prioridad.
 * @returns {void}
 */
function setupPriorityFilter() {
  const priorityFilter = getEl("priority-filter");
  if (!priorityFilter) return;

  priorityFilter.addEventListener("change", () => {
    currentPriorityFilter = priorityFilter.value;
    renderTasks();
  });
}

/**
 * Registra el selector de ordenación.
 * @returns {void}
 */
function setupSort() {
  const sortSelect = getEl("sort");
  if (!sortSelect) return;

  sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;
    renderTasks();
  });
}

/**
 * Registra acciones masivas: completar todas y eliminar completadas.
 * @returns {void}
 */
function setupBulkActions() {
  const completeAllBtn = getEl("complete-all");
  const deleteCompletedBtn = getEl("delete-completed");

  completeAllBtn?.addEventListener("click", () => {
    tasks = tasks.map(t => ({ ...t, completed: true }));
    saveTasks();
    renderTasks();
    updateStats();
  });

  deleteCompletedBtn?.addEventListener("click", () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
    updateStats();
  });
}

/**
 * Inicializa TaskFlow: registra listeners y realiza render inicial.
 * @returns {void}
 */
function initTaskFlow() {
  setupTaskForm();
  setupCharCounter();
  setupFilters();
  setupSearch();
  setupPriorityFilter();
  setupSort();
  setupBulkActions();

  // Carga desde LocalStorage y renderiza por primera vez.
  loadTasks();
  renderTasks();
  updateStats();
}

initTaskFlow();
