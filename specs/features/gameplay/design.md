# **Diseño GAME-01**

`SignalRGameAdapter` se conecta a `/hubs/game` con el JWT, ejecuta `JoinGame` y envía movimientos con `MovePlayer` o bombas con `PlaceBomb`. El servidor valida cada acción y publica el estado confirmado mediante `GameStateUpdated`.

`GameFacade` conserva el último snapshot recibido y habilita los controles únicamente cuando la conexión está lista, la partida está activa y el jugador sigue vivo. `GameInputController` transforma las flechas y WASD en movimiento, y Espacio en una orden para colocar una bomba.

`Game` ignora la repetición automática del navegador. Al mantener una dirección, conserva la tecla activa y envía un movimiento cada 220 milisegundos hasta recibir `keyup` o perder el foco. El backend aplica de igual forma un límite de 180 milisegundos para impedir ráfagas de movimientos desde otros clientes.

Cada comando incluye un `commandId`. Los bloqueos normales se devuelven mediante `CommandRejected`; el Hub reserva sus excepciones para errores reales de conexión, identidad o pertenencia a la partida.

`CanvasRenderer` dibuja el mapa, jugadores vivos, bombas y explosiones recibidas. Conserva únicamente estado visual temporal para interpolar el movimiento y alternar los dos pasos. El reloj de caminata no se reinicia con cada snapshot mientras el jugador continúa avanzando, por lo que mantener una tecla alterna ambos pies.

El backend mantiene el temporizador de dos segundos, alcance de dos celdas, bloqueo por paredes, explosiones en cadena, las tres vidas, eliminación y ganador. El frontend no calcula colisiones, daño ni resultado.

Al reconectarse, el adaptador vuelve a ejecutar `JoinGame`. El backend envía el estado actual al cliente que entra. El contrato no incluye versiones del snapshot ni un método `RequestSnapshot` independiente.
