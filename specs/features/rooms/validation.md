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

## **Creación y configuración del 25 de octubre de 2026**

Partida local y Crear sala crean primero una sala de espera y unen al creador. El anfitrión dispone de Configurar sala, que abre el mismo formulario del menú con los datos actuales. Guardar conserva los participantes y regresa a la sala.

Comprobaciones realizadas:

- En Chrome, Partida local creó una sala y abrió directamente su sala de espera.
- En Chrome, Configurar sala recuperó el tipo, el nombre, la capacidad y la pista.
- En Chrome, cambiamos la sala de local a online, actualizamos el nombre y regresamos a la misma sala.
- `npm test -- --watch=false`: correcto, 9 archivos y 38 pruebas.
- `npm run lint`: correcto.
- `npm run build`: correcto, con el aviso conocido del presupuesto de `lobby.scss`.
- `npm run format:check`: correcto.

## **Espera, bots y regreso del 25 de octubre de 2026**

La sala de espera presenta primero el nombre, después la cantidad y finalmente los jugadores. Con una sola persona, el botón muestra Esperando jugadores y permanece deshabilitado. Desde dos participantes muestra Iniciar partida. El anfitrión puede añadir varios bots mientras existan plazas.

Comprobaciones realizadas:

- Revisión en Chromium con 1 de 4 jugadores: botón Esperando jugadores deshabilitado.
- Revisión en Chromium con 3 de 4 jugadores: Bombot 1 y Bombot 2 visibles; botón Iniciar partida habilitado.
- Pruebas del repositorio local para añadir bots hasta completar la sala y devolver una partida terminada al estado de espera.
- `npm test -- --watch=false`: correcto, 9 archivos y 40 pruebas.
- `npm run lint`, `npm run build` y `npm run format:check`: correctos. El build conserva el aviso conocido de 110 bytes en `lobby.scss`.
