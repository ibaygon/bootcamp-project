# TaskFlow - Fase D (Frontend + API Node.js)

TaskFlow es una aplicacion web de gestion de tareas con frontend en JavaScript vanilla y backend en Node.js/Express.  
En esta fase, el cliente deja de usar persistencia local y consume la API REST mediante `fetch`.

## Objetivo de esta fase

- Eliminar persistencia de tareas en `LocalStorage`.
- Separar la capa de red en un cliente HTTP dedicado.
- Consumir `GET`, `POST` y `DELETE` de la API de tareas.
- Gestionar en UI estados de red: carga, exito y error.
- Documentar arquitectura y comportamiento de middlewares.

## Arquitectura de carpetas

- `index.html`: estructura de interfaz (formulario, filtros, lista, estados de red y template de tarea).
- `app.js`: capa de presentacion y estado del frontend (render, eventos, filtros, ordenacion, estadisticas, estados de red).
- `src/api/client.js`: capa de comunicacion HTTP con el backend (`fetchTasksApi`, `createTaskApi`, `deleteTaskApi`).
- `server/src/index.js`: composicion del servidor Express, registro de middlewares, rutas y middleware global de errores.
- `server/src/routes/task.routes.js`: definicion de endpoints REST de tareas.
- `server/src/controllers/task.controller.js`: validacion de entrada HTTP y delegacion al servicio.
- `server/src/services/task.service.js`: logica de dominio simple en memoria (crear, listar, eliminar).
- `docs/backend-api.md`: glosario tecnico de herramientas de API (Axios, Postman, Sentry, Swagger).

## Flujo tecnico de la aplicacion

1. El usuario abre la web y `app.js` inicializa listeners y estados de red.
2. Se ejecuta `loadTasks()` y el frontend llama a `fetchTasksApi()`.
3. La capa `src/api/client.js` consume `http://localhost:3000/api/v1/tasks`.
4. La respuesta del servidor se normaliza al modelo de UI.
5. La interfaz renderiza tareas y estadisticas.
6. En acciones de crear/eliminar, el frontend hace peticiones asicronas y actualiza estado visual (`loading`, `success`, `error`).

## API REST

Base URL:

- `http://localhost:3000/api/v1/tasks`

### GET /api/v1/tasks

Devuelve todas las tareas.

Ejemplo:

```bash
curl -X GET http://localhost:3000/api/v1/tasks
```

Respuesta `200`:

```json
[
  { "id": "1711234567890", "titulo": "Estudiar Node", "prioridad": 2 }
]
```

### POST /api/v1/tasks

Crea una nueva tarea.

Ejemplo:

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d "{\"titulo\":\"Preparar examen\",\"prioridad\":3}"
```

Reglas de validacion (controlador):

- `titulo` obligatorio, `string`, minimo 3 caracteres.
- `prioridad` obligatoria, `number`, minimo 1.

Respuesta `201`:

```json
{ "id": "1711234567891", "titulo": "Preparar examen", "prioridad": 3 }
```

Errores posibles:

- `400` si body invalido.
- `500` ante error no controlado.

### DELETE /api/v1/tasks/:id

Elimina tarea por id.

Ejemplo:

```bash
curl -X DELETE http://localhost:3000/api/v1/tasks/1711234567891
```

Respuestas:

- `204` eliminada correctamente.
- `404` si no existe (error de dominio `NOT_FOUND`).

## Middlewares explicados

En `server/src/index.js`:

- `cors()`: habilita CORS para permitir que el frontend (otro origen/puerto) consuma la API.
- `express.json()`: parsea JSON del body y lo expone en `req.body`.
- `app.use('/api/v1/tasks', taskRoutes)`: monta el router versionado.
- Middleware global de errores (al final):
  - Traduce error de dominio `NOT_FOUND` a `404`.
  - Registra errores internos en consola.
  - Retorna `500` estandar para excepciones no controladas.

## Estados de red en frontend

La UI maneja tres estados visuales:

- `loading`: mensaje de carga mientras la peticion esta en curso.
- `success`: feedback al completar operaciones correctamente.
- `error`: mensaje de error cuando la API devuelve `4xx/5xx` o falla la red.

Esto evita interfaces "silenciosas" y mejora UX ante latencia o caidas.

## Ejecutar en local

### 1) Backend

```bash
cd server
npm install
npm run dev
```

### 2) Frontend

Servir el proyecto con Live Server (o cualquier servidor estatico) desde la raiz del repo y abrir `index.html`.

## Notas de modelado

- El backend guarda tareas en memoria (no base de datos).
- El backend expone campos `titulo/prioridad`; el frontend los adapta al modelo visual `title/priority`.
- El estado `completed` en esta fase se mantiene en cliente para la UI.
# Bootcamp Project
Este es mi primer proyecto del bootcamp., consiste en crear una aplicación que permita 
crear, completar, eliminar y filtrar tareas.

# TaskFlow (Bootcamp Project)

Aplicación web sencilla para **gestionar tareas** (crear, completar y eliminar), con **estadísticas**, **búsqueda**, **filtros**, **prioridades**, **ordenación** y **modo oscuro**.  
Proyecto pensado para practicar JavaScript (DOM + LocalStorage) en un entorno tipo ASIR.

## Demo

- Web (Vercel): [TaskFlow](https://bootcamp-project-j83e.vercel.app/)

## Funcionalidades

- **Crear tareas**: escribiendo el nombre y pulsando **Agregar**.
- **Prioridades**: cada tarea tiene prioridad **Alta / Media / Baja** (se muestra como una etiqueta de color).
- **Completar tareas**: con el checkbox.
- **Eliminar tareas**: botón **Eliminar** con **confirmación** antes de borrar.
- **Estadísticas**: total, completadas y pendientes.
- **Filtros**:
  - Por estado: **Todas / Activas / Completadas**
  - Por prioridad: **Todas / Alta / Media / Baja**
- **Búsqueda**: filtra mientras escribes.
- **Ordenación (solo visual)**: **por fecha**, **por nombre** o **por prioridad** (no modifica el array original).
- **Acciones masivas**: **Completar todas** y **Eliminar completadas**.
- **Modo oscuro**: botón para alternar tema (se guarda en LocalStorage).
- **Contador de caracteres**: muestra `0/50` y se actualiza mientras escribes (con límite de 50).

## Cómo ejecutarlo en local

No necesitas instalar dependencias.

## Ejemplos de uso (rápido)

- **Crear una tarea con prioridad**
  1. Escribe un nombre en “Nombre de la tarea” (verás el contador `X/50`).
  2. Elige la **prioridad** (Alta / Media / Baja).
  3. Pulsa **Agregar**.

- **Marcar como completada**
  - Pulsa el **checkbox** de la tarea.

- **Editar una tarea**
  - Haz **doble click** sobre el texto de la tarea y escribe el nuevo nombre.

- **Eliminar una tarea (con confirmación)**
  - Pulsa **Eliminar** y confirma el mensaje “¿Seguro que quieres borrar esta tarea?”.

- **Buscar tareas**
  - Escribe en el campo **Buscar tareas...** y la lista se filtra mientras escribes.

- **Filtrar**
  - Por estado: usa los botones **Todas / Activas / Completadas**.
  - Por prioridad: usa el selector **Todas las prioridades / Solo alta / ...**

- **Ordenar (sin modificar los datos)**
  - Usa el selector **Ordenar por fecha / nombre / prioridad** para cambiar el orden de visualización.

- **Acciones masivas**
  - **Completar todas**: marca todas como completadas.
  - **Eliminar completadas**: borra solo las que están completadas.

- **Modo oscuro**
  - Pulsa el botón 🌙 para alternar tema (se guarda para la próxima vez).

### Opción A: abrir el HTML

1. Abre `index.html` en el navegador.

### Opción B (recomendado): Live Server (VS Code / Cursor)

1. Instala la extensión **Live Server**.
2. Abre `index.html` y pulsa **Go Live**.

## Datos y persistencia

- Las tareas se guardan en **LocalStorage** del navegador (`tasks`).
- El tema (claro/oscuro) se guarda en LocalStorage (`theme`).

## Estructura del proyecto

- `index.html`: interfaz (formulario, filtros, lista y plantilla de tareas).
- `app.js`: lógica (crear/renderizar tareas, filtros, ordenación, eventos y LocalStorage).
- `Design/style.css`: estilos antiguos/pruebas (la UI actual usa Tailwind CDN).

## Notas

- Si ya tenías tareas guardadas de versiones anteriores, el sistema asigna automáticamente prioridad **Media** a las tareas antiguas.
