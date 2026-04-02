import { fetchTasksApi, createTaskApi, deleteTaskApi } from "./server/src/api/client.js";

let tasks = [];
let currentFilter = "all";
let currentPriorityFilter = "all";
let currentSort = "date";
let isLoading = false;
let networkError = "";
let networkSuccess = "";

const getEl = (id) => document.getElementById(id);
const normalizePriority = (p) => (["alta", "media", "baja"].includes((p || "").toLowerCase()) ? p.toLowerCase() : "media");

function setupThemeToggle() {
  const btn = getEl("toggle-dark");
  btn?.addEventListener("click", () => document.documentElement.classList.toggle("dark"));
}

function getPriorityMeta(priority) {
  const p = normalizePriority(priority);
  if (p === "alta") return { label: "Alta", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" };
  if (p === "baja") return { label: "Baja", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" };
  return { label: "Media", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" };
}

function setNetworkState({ loading, error, success }) {
  if (typeof loading === "boolean") isLoading = loading;
  if (typeof error === "string") networkError = error;
  if (typeof success === "string") networkSuccess = success;

  getEl("network-loading")?.classList.toggle("hidden", !isLoading);
  getEl("network-error")?.classList.toggle("hidden", !networkError);
  getEl("network-success")?.classList.toggle("hidden", !networkSuccess);
  if (getEl("network-error")) getEl("network-error").textContent = networkError;
  if (getEl("network-success")) getEl("network-success").textContent = networkSuccess;
}

function filteredAndSortedTasks() {
  const search = (getEl("search")?.value || "").toLowerCase();
  const rank = (priority) => (priority === "alta" ? 0 : priority === "media" ? 1 : 2);

  let visible = tasks.filter((t) => t.title.toLowerCase().includes(search));
  if (currentFilter === "pending") visible = visible.filter((t) => !t.completed);
  if (currentFilter === "completed") visible = visible.filter((t) => t.completed);
  if (currentPriorityFilter !== "all") visible = visible.filter((t) => normalizePriority(t.priority) === currentPriorityFilter);

  const list = [...visible];
  if (currentSort === "name") return list.sort((a, b) => a.title.localeCompare(b.title, "es", { sensitivity: "base" }));
  if (currentSort === "priority") {
    return list.sort((a, b) => {
      const byPriority = rank(a.priority) - rank(b.priority);
      if (byPriority !== 0) return byPriority;
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    });
  }
  return list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

function renderStats() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  getEl("total").textContent = String(total);
  getEl("completed").textContent = String(completed);
  getEl("pending").textContent = String(total - completed);
}

function renderTasks() {
  const list = getEl("tasks");
  const template = getEl("task-template");
  list.innerHTML = "";

  filteredAndSortedTasks().forEach((task) => {
    const clone = template.content.cloneNode(true);
    const li = clone.querySelector("li");
    const checkbox = clone.querySelector(".task-check");
    const text = clone.querySelector(".task-text");
    const priorityEl = clone.querySelector(".task-priority");
    const deleteBtn = clone.querySelector(".delete-btn");

    text.textContent = task.title;
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      tasks = tasks.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t));
      renderTasks();
      renderStats();
    });

    const meta = getPriorityMeta(task.priority);
    priorityEl.textContent = meta.label;
    priorityEl.className = `task-priority px-2 py-1 text-xs font-semibold rounded ${meta.className}`;

    deleteBtn.addEventListener("click", async () => {
      if (!confirm("¿Seguro que quieres borrar esta tarea?")) return;
      li.classList.add("opacity-0", "translate-y-2");
      setTimeout(async () => {
        setNetworkState({ loading: true, error: "", success: "" });
        try {
          await deleteTaskApi(task.id);
          tasks = tasks.filter((t) => t.id !== task.id);
          setNetworkState({ loading: false, error: "", success: "Tarea eliminada correctamente." });
        } catch (error) {
          setNetworkState({ loading: false, error: error?.message || "No se pudo eliminar la tarea.", success: "" });
        }
        renderTasks();
        renderStats();
      }, 200);
    });

    list.appendChild(clone);
    requestAnimationFrame(() => li.classList.remove("opacity-0", "translate-y-2"));
  });
}

function setupEvents() {
  setupThemeToggle();

  const form = getEl("task-form");
  const input = getEl("task-input");
  const priority = getEl("task-priority");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = input.value.trim();
    if (!title) return;
    setNetworkState({ loading: true, error: "", success: "" });
    try {
      const task = await createTaskApi(title, normalizePriority(priority.value));
      tasks.push(task);
      input.value = "";
      setNetworkState({ loading: false, error: "", success: "Tarea creada correctamente." });
    } catch (error) {
      setNetworkState({ loading: false, error: error?.message || "No se pudo crear la tarea.", success: "" });
    }
    renderTasks();
    renderStats();
  });

  const counter = getEl("char-counter");
  if (input && counter) {
    const max = Number(input.getAttribute("maxlength")) || 50;
    const paint = () => {
      counter.textContent = `${input.value.length}/${max} caracteres`;
    };
    paint();
    input.addEventListener("input", paint);
  }

  document.querySelectorAll("#filters button").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });
  getEl("search")?.addEventListener("input", renderTasks);
  getEl("priority-filter")?.addEventListener("change", (e) => {
    currentPriorityFilter = e.target.value;
    renderTasks();
  });
  getEl("sort")?.addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderTasks();
  });

  getEl("complete-all")?.addEventListener("click", () => {
    tasks = tasks.map((t) => ({ ...t, completed: true }));
    renderTasks();
    renderStats();
  });

  getEl("delete-completed")?.addEventListener("click", async () => {
    const completed = tasks.filter((t) => t.completed);
    if (!completed.length) return;
    setNetworkState({ loading: true, error: "", success: "" });
    try {
      await Promise.all(completed.map((t) => deleteTaskApi(t.id)));
      tasks = tasks.filter((t) => !t.completed);
      setNetworkState({ loading: false, error: "", success: "Tareas completadas eliminadas." });
    } catch (error) {
      setNetworkState({ loading: false, error: error?.message || "No se pudieron eliminar las tareas completadas.", success: "" });
    }
    renderTasks();
    renderStats();
  });
}

async function init() {
  setupEvents();
  setNetworkState({ loading: true, error: "", success: "" });
  try {
    tasks = await fetchTasksApi();
    setNetworkState({ loading: false, error: "", success: "Tareas cargadas correctamente." });
  } catch (error) {
    tasks = [];
    setNetworkState({ loading: false, error: error?.message || "No se pudieron cargar las tareas.", success: "" });
  }
  renderTasks();
  renderStats();
}

void init();
