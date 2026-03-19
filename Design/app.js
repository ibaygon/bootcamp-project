// 7.1 Guarda las tareas en LocalStorage usando JSON.stringify
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 7.2 Recupera las tareas cuando se carga la página usando JSON.parse
function loadTasks() {
  const stored = localStorage.getItem("tasks");
  tasks = stored ? JSON.parse(stored) : [];
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
let currentFilter = "all"; // filtro: all | pending | completed



function generateId() {
  return Date.now().toString();
}



// 6.2 Define la estructura de una tarea como un objeto con id, title, completed y createdAt
function createTask(title) {
  return {
    id: generateId(),
    title: title,
    completed: false,
    createdAt: new Date().toISOString()
  };
}



// 6.3 Implementa la funcionalidad para añadir nuevas tareas
function addTask(title) {
  const newTask = createTask(title);
  tasks.push(newTask);
  saveTasks(); 
  renderTasks();
  updateStats();
}



// 6.4 Renderiza las tareas en el DOM
function renderTasks() {
  const list = document.getElementById("tasks");
  const template = document.getElementById("task-template");
  const searchText = document.getElementById("search")?.value.toLowerCase() || "";

  list.innerHTML = ""; 

  let filteredTasks = tasks;

  // 8.1 Implementa un filtro para ver tareas: todas, pendientes y completadas
  if (currentFilter === "pending") {
    filteredTasks = filteredTasks.filter(t => !t.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = filteredTasks.filter(t => t.completed);
  }

  // 8.2 Añade una búsqueda por texto en las tareas
  filteredTasks = filteredTasks.filter(task =>
    task.title.toLowerCase().includes(searchText)
  );

  filteredTasks.forEach(task => {
    const clone = template.content.cloneNode(true);

    const li = clone.querySelector("li");
    const checkbox = clone.querySelector(".task-check");
    const text = clone.querySelector(".task-text");
    const deleteBtn = clone.querySelector(".delete-btn");

    text.textContent = task.title;
    checkbox.checked = task.completed;

    // 8.3 Permite editar el título de una tarea existente
    text.addEventListener("dblclick", () => {
      const newTitle = prompt("Editar tarea:", task.title);
      if (newTitle && newTitle.trim() !== "") {
        task.title = newTitle.trim();
        saveTasks();
        renderTasks();
      }
    });

    checkbox.addEventListener("change", () => toggleTask(task.id));
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    list.appendChild(clone);
  });
}



// 6.5 Permite marcar tareas como completadas
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks(); 
  renderTasks();
  updateStats();
}



// 6.6 Permite eliminar tareas
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks(); 
  renderTasks();
  updateStats();
}



// 6.7 Actualiza las estadísticas cuando cambien las tareas
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  document.getElementById("total").textContent = total;
  document.getElementById("completed").textContent = completed;
  document.getElementById("pending").textContent = pending;
}



// 6.8 Evita repetir código creando funciones reutilizables
document.getElementById("task-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const input = document.getElementById("task-input");
  const title = input.value.trim();

  if (title !== "") {
    addTask(title);
    input.value = "";
  }
});



// 8.1 Implementa un filtro para ver tareas: todas, pendientes y completadas
document.querySelectorAll("#filters button").forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});



// 8.2 Añade una búsqueda por texto en las tareas
document.getElementById("search").addEventListener("input", renderTasks);



// 8.4 Añade un botón para marcar todas las tareas como completadas
document.getElementById("complete-all").addEventListener("click", () => {
  tasks = tasks.map(t => ({ ...t, completed: true }));
  saveTasks();
  renderTasks();
  updateStats();
});



// 8.5 Añade un botón para borrar todas las tareas completadas
document.getElementById("delete-completed").addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
  updateStats();
});



// 7.3 Maneja correctamente el caso en que no haya datos guardados
loadTasks();   
renderTasks();
updateStats();
