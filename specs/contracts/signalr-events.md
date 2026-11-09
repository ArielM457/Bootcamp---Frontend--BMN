# **Contrato SignalR validado**

Estado: validado contra el backend de la sesión 08. Ruta: `/hubs/game`. La conexión presenta el JWT mediante `accessTokenFactory`.

## **Métodos disponibles**

- `JoinGame(gameId)`: valida el JWT y la pertenencia del jugador antes de agregar la conexión al grupo de la sala.
- `MovePlayer(direction)`: acepta `up`, `down`, `left` o `right`. El servidor calcula y valida la posición.

## **Eventos disponibles**

- `PlayerConnected(playerId)`.
- `PlayerDisconnected(playerId)`.
- `PlayerMoved(playerId, x, y)`.
- `GameStateUpdated(gameState)`, con `id`, `roomId`, `status`, `map` y `players`.

## **Límites actuales**

El backend no ofrece `PlaceBomb`, `RequestSnapshot`, `RestartGame` ni `CommandRejected`. Tampoco envía versión, vidas, bombas, explosiones, tiempo, ganador o puntuaciones dentro de `GameStateUpdated`. Al reconectar, el cliente vuelve a ejecutar `JoinGame`, que envía el estado actual disponible.
