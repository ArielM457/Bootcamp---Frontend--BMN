# **Validación ROOM-01**

Fecha: 18 de octubre de 2026.

Estado: flujo local implementado y comprobado manualmente por el usuario el 18 de octubre de 2026. Integración HTTP y presencia en tiempo real pendientes.

Implementamos listado, estado vacío, creación, unión, sala llena, sala de espera, participantes, bot local, salida y permiso para iniciar. Las pantallas usan `RoomFacade` y no acceden al almacenamiento ni al transporte.

Reglas comprobadas:

- Una sala válida asigna al creador como anfitrión.
- Un jugador no se agrega dos veces.
- Una sala llena rechaza nuevos jugadores.
- Un jugador no puede estar en dos salas de espera.
- Solo el anfitrión puede iniciar.
- Se necesitan al menos 2 jugadores para iniciar.
- El anfitrión puede añadir un único bot cuando existe una plaza libre.
- El bot ocupa una plaza y permite iniciar la partida con un solo jugador humano.
- Otro jugador no puede añadir el bot.
- El bot no ejecuta acciones ni puede quedar como anfitrión.
- Cuando sale el anfitrión, el siguiente jugador ocupa su lugar.
- Una sala sin jugadores humanos se elimina.

Comprobaciones realizadas:

- `npm test -- --watch=false`: correcto, 5 archivos y 19 pruebas.
- `npm run build`: correcto.
- `npm run lint`: correcto.
- `npm run format:check`: correcto.

Las salas precargadas y los cambios viven en memoria. No afirmamos sincronización entre navegadores ni integración con el backend.

El usuario confirmó en navegador que el flujo de sala, bot e inicio de partida funciona correctamente.
