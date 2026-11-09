# **Diseño REAL-01**

`GamePort` abstrae snapshots, estado de conexión, movimientos y reconexión. `SignalRGameAdapter` obtiene el JWT de la sesión, conecta con `/hubs/game`, invoca `JoinGame` y escucha `PlayerMoved` y `GameStateUpdated`. `GameFacade` bloquea movimientos cuando la conexión no está lista.

El adaptador envía solo la dirección mediante `MovePlayer`; nunca envía coordenadas calculadas por el cliente. Al reconectarse vuelve a unirse a la partida. El Canvas continúa limitado al renderizado. El contrato actual no incluye bombas, reinicio, `commandId`, versiones del estado ni un método independiente para solicitar snapshots.
