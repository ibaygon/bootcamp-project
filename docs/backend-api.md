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


