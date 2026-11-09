# **Diseño GAME-01**

`SignalRGameAdapter` se conecta a `/hubs/game` con el JWT, ejecuta `JoinGame` y envía movimientos con `MovePlayer`. El servidor recibe solo la dirección, valida el movimiento y publica el mapa y las posiciones confirmadas mediante `GameStateUpdated`.

`GameFacade` conserva el último snapshot recibido y habilita los controles únicamente cuando la conexión está lista y la partida está activa. `GameInputController` transforma las flechas y WASD en comandos de movimiento. No genera comandos de bombas ni reinicio porque el backend no los ofrece.

`CanvasRenderer` dibuja el mapa y las posiciones recibidas. Conserva únicamente estado visual temporal para interpolar el movimiento entre una posición confirmada y la siguiente. La dirección selecciona el sprite correspondiente y los colores de apoyo son una decisión visual; no representan estado de juego.

El frontend no muestra vidas, bombas, explosiones, poderes, tiempo, ganador ni puntuación. Esos datos no existen en `GameStateUpdated`. Tampoco calcula colisiones ni posiciones localmente.

Al reconectarse, el adaptador vuelve a ejecutar `JoinGame`. El backend envía el estado actual al cliente que entra. El contrato no incluye versiones del snapshot ni un método `RequestSnapshot` independiente.
