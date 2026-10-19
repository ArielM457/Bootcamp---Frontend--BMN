# **Guía de integración con backend**

La interfaz ya funciona con adaptadores locales. Para conectarla a un backend no debemos cambiar componentes ni facades. Debemos implementar las mismas interfaces y seleccionar los adaptadores reales en `app.config.ts`.

## **Autenticación**

Implementamos `AuthRepository` con registro, acceso, restauración de sesión y cierre. El adaptador HTTP debe validar los DTO y errores de `specs/contracts/openapi.yaml`. Los tokens deben permanecer fuera de componentes.

## **Salas**

Implementamos `RoomRepository` para listar, consultar, crear, unirse, añadir bot, salir e iniciar. Antes de conectar HTTP debemos acordar si el backend admite bots y cómo representa `RoomParticipant.kind`.

## **Partida y conexión**

Implementamos `GamePort` para snapshots, conexión, rechazos, comandos y reconexión. El adaptador SignalR debe enviar `commandId`, descartar versiones anteriores y recuperar un snapshot antes de habilitar controles. El servidor debe decidir colisiones, daño, explosiones, resultado y presencia.

## **Resultados**

Implementamos `ScoreRepository` para registrar resultados y consultar el ranking. La fórmula actual es local. El adaptador HTTP debe usar los puntos y el orden confirmados por el servidor sin recalcularlos en la interfaz.

## **Comprobaciones necesarias**

Antes de activar adaptadores reales debemos comprobar:

- URL y versión de la API.
- Forma exacta de solicitudes, respuestas y errores.
- Encabezado de autenticación y renovación de sesión.
- URL del hub, eventos y orden de versiones.
- Recuperación después de perder la conexión.
- Idempotencia de comandos y resultados.
- Reglas de bot, puntuación y desempate.
- Pruebas de contrato contra OpenAPI.
- Flujo real en dos navegadores.

Hasta completar estas comprobaciones, la configuración debe conservar los adaptadores locales.
