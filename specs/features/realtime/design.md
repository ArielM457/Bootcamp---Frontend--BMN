# **Diseño REAL-01**

`GamePort` abstrae snapshots, estado de conexión, movimientos y reconexión. `SignalRGameAdapter` obtiene el JWT de la sesión, conecta con `/hubs/game`, invoca `JoinGame` y escucha `PlayerMoved` y `GameStateUpdated`. `GameFacade` bloquea movimientos cuando la conexión no está lista.

El adaptador envía la dirección y el `commandId` mediante `MovePlayer`; nunca envía coordenadas calculadas por el cliente. De igual forma envía `PlaceBomb` con el identificador del comando. Los rechazos normales llegan mediante `CommandRejected`. Al reconectarse vuelve a unirse a la partida. El Canvas continúa limitado al renderizado. El contrato actual no incluye reinicio, versiones generadas por el backend ni un método independiente para solicitar snapshots.
