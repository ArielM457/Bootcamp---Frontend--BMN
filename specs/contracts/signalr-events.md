# **Contrato SignalR validado**

Estado: validado contra el backend de la sesión 08. Ruta: `/hubs/game`. La conexión presenta el JWT mediante `accessTokenFactory`.

## **Métodos disponibles**

- `JoinGame(gameId)`: valida el JWT y la pertenencia del jugador antes de agregar la conexión al grupo de la sala.
- `MovePlayer(direction, commandId)`: acepta `up`, `down`, `left` o `right`. El servidor calcula y valida la posición.
- `PlaceBomb(commandId)`: coloca una bomba en la posición confirmada del jugador. Solo admite una bomba activa por jugador.

## **Eventos disponibles**

- `PlayerConnected(playerId)`.
- `PlayerDisconnected(playerId)`.
- `PlayerMoved(playerId, x, y)`.
- `GameStateUpdated(gameState)`, con `id`, `roomId`, `status`, `winnerPlayerId`, `map`, `players`, `bombs` y `explosions`.
- `CommandRejected(commandId, message)`: informa al cliente que una acción normal no pudo aplicarse. Chocar con paredes, bombas o bordes no genera una excepción del Hub.

## **Límites actuales**

El backend no ofrece `RequestSnapshot` ni `RestartGame`. Tampoco envía puntuaciones ni tiempo total dentro de `GameStateUpdated`. Al reconectar, el cliente vuelve a ejecutar `JoinGame`, que envía el estado actual disponible.
