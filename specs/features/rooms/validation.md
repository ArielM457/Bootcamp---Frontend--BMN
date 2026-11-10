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

## **Código e inicio compartido del 9 de noviembre de 2026**

Implementamos en el backend un código único persistido de 8 caracteres, la unión por código y la entrega de `gameId` en el detalle cuando la partida ya comenzó. El creador ve el código en la sala de espera. Los demás participantes actualizan el detalle cada segundo y entran al juego cuando reciben el inicio.

La migración asigna también códigos únicos a las salas existentes. La integración conserva HTTP para la espera y SignalR para el estado y los movimientos dentro de la partida.

Comprobaciones realizadas:

- `dotnet build --configuration Release`: correcto, con la advertencia previa de nulabilidad en `PlayerService.cs`.
- `dotnet ef database update --no-build --configuration Release`: migración aplicada correctamente en PostgreSQL.
- Prueba HTTP real con dos usuarios: código de 8 caracteres, unión correcta, 2 participantes, estado `playing` y el mismo `gameId` para el segundo usuario.
- `npm run build`: correcto, con el aviso conocido de 110 bytes en `lobby.scss`.
- ESLint de los archivos TypeScript modificados: correcto.
- Vitest no ejecutó pruebas porque sus workers agotaron el tiempo tanto con procesos como con hilos. No hubo fallos de aserción.

Falta la revisión visual en navegador y confirmar la navegación automática con dos ventanas reales. La prueba HTTP dejó una sala y dos usuarios temporales identificados con el sufijo `68c0c11f9d` porque el proyecto no ofrece un flujo de eliminación para esos registros.

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

## **Creador y jugadores listos del 9 de noviembre de 2026**

Implementamos `hostPlayerId` en la sala e `isReady` en cada participante. Solo el creador puede iniciar. Los invitados pueden cambiar únicamente su propio estado entre Listo y No listo. El backend exige al menos dos participantes y que todos los invitados estén listos antes de crear la partida.

La prueba HTTP real confirmó que el invitado recibe `403` al intentar iniciar, el creador recibe `409` antes de que el invitado esté listo y el inicio funciona después de marcarlo como listo. La partida creada incluyó dos jugadores y ambos recibieron el mismo `gameId`.

La migración `AddRoomHostAndReady` se aplicó correctamente en PostgreSQL. Las salas anteriores asignan como creador al participante con menor identificador y lo dejan listo.

Las pruebas del frontend terminaron con 7 archivos y 15 pruebas aprobadas. Incluyen una prueba enfocada que comprueba que solo el creador puede iniciar y que el invitado puede cambiar su estado listo.
