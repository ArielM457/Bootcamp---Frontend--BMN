# **Validación QA-01**

Fecha: 18 de octubre de 2026.

Estado: mejoras locales de calidad implementadas. Revisión manual final pendiente.

Implementamos un enlace para saltar al contenido, foco global visible, reducción de animaciones, controles direccionales más grandes y un ranking móvil que conserva todos sus datos. Actualizamos la documentación y añadimos una guía para reemplazar adaptadores locales por integraciones reales.

La prueba de flujo recorre:

- Creación de una sala.
- Incorporación del bot.
- Inicio de la partida.
- Movimiento confirmado mediante snapshot.
- Registro de una victoria.
- Aparición del jugador en el primer lugar del ranking.

Comprobaciones realizadas:

- `npm test -- --watch=false`: correcto, 7 archivos y 24 pruebas.
- `npm run lint`: correcto.
- `npm run build`: correcto.
- `npm run format:check`: correcto.
- `npm run validate`: correcto.

Pendiente:

- Recorrer con teclado todas las pantallas en un navegador real.
- Probar los controles táctiles en un dispositivo físico.
- Probar el flujo compartido cuando exista backend.

## **Selección de adaptadores (tarea 7)**

Fecha: 22 de octubre de 2026.

Estado: implementado según el ADR 0002. El modo `demo` registra los adaptadores locales. El modo `api` falla al iniciar con un mensaje que nombra los adaptadores HTTP y SignalR pendientes.

`src/app/app.config.spec.ts` añade tres pruebas:

- Modo `demo`: cada token resuelve a su adaptador local.
- Modo `api`: `provideDataAdapters('api')` lanza el error esperado.
- `appConfig` usa el modo `demo` del environment por defecto.

Comprobaciones realizadas:

- `npm run validate`: correcto. 8 archivos y 29 pruebas, de las cuales 2 vienen de cambios de `welcome` en curso; esta tarea deja 27 pruebas.
- `npx ng build --configuration production,api`: compila y el bundle contiene el mensaje del modo `api`.
- Revisión manual con `npx ng serve --configuration api`: la consola del navegador muestra `Uncaught Error: Modo 'api' no disponible…` desde `provideDataAdapters` y la app no arranca.

Pendiente:

- Implementar los adaptadores reales.
