# **GAME-01 · Partida y tablero**

Estado: integrado con el backend de las sesiones 05 a 08.

Como jugador autenticado quiero entrar a una partida y moverme en el tablero con el estado confirmado por el servidor.

Requisitos actuales:

- Recibir mapa y posiciones mediante `GameStateUpdated`.
- Enviar únicamente direcciones válidas mediante `MovePlayer`.
- Mostrar solo movimientos aceptados por el servidor.
- Mantener los eventos aislados por sala.
- Volver a unirse a la partida después de una reconexión.
- No simular vidas, bombas, explosiones, tiempo, ganador ni puntuación.

Depende de AUTH-01, ROOM-01 y el contrato de SignalR.
