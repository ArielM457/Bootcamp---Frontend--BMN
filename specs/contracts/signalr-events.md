# **Contrato SignalR propuesto**

Estado: pendiente de validar. Hub propuesto: `/hubs/game`. El cliente presenta JWT en la conexión según el mecanismo acordado con ASP.NET Core. Ningún evento sustituye la autorización del servidor.

## **Comandos del cliente**

- `JoinRoom` con `{ roomId, commandId }`. El servidor comprueba membresía y añade la conexión al grupo de sala.
- `LeaveRoom` con `{ roomId, commandId }`. Sale del grupo; la política de salida de la partida queda por definir.
- `Move` con `{ gameId, commandId, direction }`, donde `direction` es `up`, `down`, `left` o `right`. El cliente no envía coordenadas definitivas.
- `PlaceBomb` con `{ gameId, commandId }`. El servidor decide posición, límite y detonación.
- `RequestSnapshot` con `{ gameId }` para recuperar estado tras conectar o reconectar.

`commandId` es UUID para correlacionar confirmación o rechazo. La conexión y desconexión son eventos de transporte; no se aceptan como prueba de presencia o resultado de juego.

## **Eventos del servidor**

- `RoomJoined` con `{ roomId, participants }`.
- `ParticipantConnected` y `ParticipantDisconnected` con `{ roomId, playerId }`.
- `GameStarted` con `{ gameId, snapshot }`.
- `MoveConfirmed` con `{ gameId, commandId, playerId, x, y, version }`.
- `BombPlaced` con `{ gameId, commandId, bomb, version }`.
- `BombExploded` con `{ gameId, bombId, explosion, destroyedCells, version }`.
- `GameStateUpdated` con `{ snapshot }`.
- `GameFinished` con `{ gameId, snapshot, scores }`.
- `CommandRejected` con `{ commandId, code, message }`.

`snapshot` sigue [game-models.md](game-models.md). Todos los eventos de partida confirmados incluyen versión o snapshot versionado. Se descartan versiones anteriores a la última aplicada. Tras reconectar, el cliente pide snapshot antes de reanudar controles. Debemos acordar frecuencia, orden garantizado, idempotencia, tiempos y códigos de rechazo antes de integrar SignalR.
