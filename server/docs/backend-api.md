# Backend API tooling: conceptos clave

## Axios

Axios es una libreria de JavaScript para realizar peticiones HTTP desde el navegador o Node.js, es una alternativa as comoda y potente que fetch.

Por que se usa:

- Utiliza automaticamente JSON  
- Puede configurar interceptores para controlar errores globales
- Funciona igual en el frontend y backend
- Tiene cancelacion de peticiones

## Postman

Postman es una herramienta para probar APIs que no necesita que escribas codigo

Por que se usa:

- Puede enviar peticiones GET, POST, PUT y DELETE 
- Guarda colecciones de endpoints   
- Da la libertad de probar APIs antes de conecel frontend   
- Ayuda a eliminar errores del backend
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

## Sentry

Sentry es una plataforma de monitorizacion enfocada en errores para aplicaciones de frontend y backend

Por que se usa:

- Detecta errores de produccion de forma automatica
- Tiene stack trace (guarda trazas completas del error)
- Puedes ver las especificaciones de donde ocurrio el fallo (usuario, navegador o endpoint)

## Swagger (OpenAPI)

Swagger es el conjunto de herramientas que usan como base la especificacion en OpenAI y permite documentar APIs REST de forma estandar

Por que se usa:

- Crea documentacion interactiva
- Puede probar endpoints desde el navegador
- Facilita que otros entiendan tu API
- Puede generar clientes automaticos a partir de la documentacion


