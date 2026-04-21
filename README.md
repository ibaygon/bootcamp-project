# TaskFlow – Fase D (Frontend)

TaskFlow es una aplicación web de gestión de tareas desarrollada en **JavaScript Vanilla**, enfocada en practicar DOM, eventos, estados visuales y comunicación con un backend.  
En esta fase, el frontend deja de usar LocalStorage y pasa a consumir datos desde un servidor externo mediante `fetch`.

---

# Características del Frontend

- **Crear tareas** mediante formulario.
- **Eliminar tareas** con confirmación.
- **Completar tareas** con checkbox.
- **Filtros por estado**: Todas / Activas / Completadas.
- **Filtros por prioridad**: Alta / Media / Baja.
- **Búsqueda en tiempo real**.
- **Ordenación visual** por fecha, nombre o prioridad.
- **Estadísticas**: total, completadas y pendientes.
- **Modo oscuro** persistente.
- **Contador de caracteres** en el input.
- **Estados de red visibles**:
  - `loading` → cargando datos
  - `success` → operación completada
  - `error` → fallo al conectar con el servidor

---

# Tecnologías utilizadas

### **Lenguajes**
- JavaScript (ES6+)
- HTML5
- CSS3
- Tailwind CSS (CDN)

### **Frontend**
- DOM API
- Fetch API
- Eventos y manipulación dinámica del DOM

### **Herramientas utilizadas**
- **Cursor** (editor inteligente)
- **Claude** (asistente para documentación y refactor)
- **Live Server** (NO es IA → servidor estático para desarrollo local)

---

# Estructura del proyecto (Frontend)

/index.html         interfaz principal
/app.js             lógica de UI, eventos y renderizado
/src/api/client.js  funciones fetch hacia el backend
/Design/style.css   estilos antiguos (UI actual usa Tailwind CDN)


---

# Cómo descargar el proyecto

### Opción A — Git Clone
```bash
git clone https://github.com/ibaygon/bootcamp-project
cd bootcamp-project
```

### Opción B — Descargar ZIP
Entra al repositorio en GitHub.

Pulsa Code Download ZIP.

Extrae el archivo en tu ordenador.

## Cómo ejecutar el proyecto en local

### 1 Iniciar el backend (necesario para esta fase)
El backend se encuentra en la carpeta `server/`.

```bash
cd server
npm install
npm run dev
```

### 2 Iniciar el frontend
El frontend es un proyecto estático, así que no necesita dependencias ni build.

Opción recomendada — Live Server
Abre la carpeta del proyecto en VS Code o Cursor.

Instala la extensión Live Server.

Abre index.html.

Pulsa Go Live para servirlo en un puerto local.

# Despliegue en Vercel

El proyecto está desplegado en Vercel como sitio estático.

Pasos realizados para el despliegue
Subir el proyecto a un repositorio de GitHub.

Entrar en https://vercel.com.

Pulsar New Project y seleccionar el repositorio.

Configurar:

Framework Preset: None (Static Site)

Output Directory: raíz del proyecto (donde está index.html)

Pulsar Deploy.

# Notas 

- El frontend ya no usa LocalStorage para almacenar tareas.
- El estado completed se mantiene en el cliente para la UI.
- El backend almacena las tareas en memoria, solo para desarrollo.
- Esta fase se centra en:
- Renderizado dinámico con JavaScript
- Estados visuales (loading, success, error)
- Comunicación con backend mediante fetch
- Mejora de UX y estructura del código