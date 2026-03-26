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
